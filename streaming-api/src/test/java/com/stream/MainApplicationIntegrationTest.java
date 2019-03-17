package com.stream;

import ch.qos.logback.classic.Level;
import com.stream.entitytype.user.UserRepository;
import com.stream.entitytype.user.streamer.UserWebLmaxDistruptorStreamer;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.logMessage.LogMessage;
import com.stream.utils.TestHelperUtils;
import com.stream.entitytype.logMessage.LogMessageRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.junit4.SpringRunner;
import javax.inject.Inject;
import java.io.File;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

import static com.stream.utils.ThrowingConsumer.throwingConsumerWrapper;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * MainApplication End2EndTest of the spring boot application, given an inputLogFile
 *
 * @author andy.ng@test.io
 *
 */

@RunWith(SpringRunner.class)
@SpringBootTest
@PropertySource("classpath:/test.properties")
public class MainApplicationIntegrationTest {
    private static final Logger logger = LoggerFactory.getLogger(MainApplicationIntegrationTest.class);

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    @Inject
    @Qualifier("logMessageStreamers")
    List<ResourceStreamer> logMessageStreamers;

    @Inject
    @Qualifier("userStreamers")
    public List<ResourceStreamer> userStreamers;

    @Inject
    private LogMessageRepository logRepositoryService;

    @Inject
    private UserWebLmaxDistruptorStreamer userWebLmaxDistruptorStreamer;

    @Inject
    private UserRepository userRepositoryService;

    @Value("${spring.application.alertInMs}")
    private int alertInMs;

    private TestHelperUtils testHelperUtils;
    private MainApplication application;

    @Before
    public void before() {
        testHelperUtils = new TestHelperUtils();
        application = new MainApplication();
    }

    @After
    public void tierdown() {
        logRepositoryService.deleteAll();
    }

    @Test
    public void shouldProcessedLogMessageStreamersAndPersist() throws Exception {
        // Given
        String filePath = new ClassPathResource("logMessage.log").getFile().getPath();

        logMessageStreamers.forEach(throwingConsumerWrapper(streamer -> {
            // When
            application.stream(streamer, filePath);
            // Then
            assertThat(verifyDBEntryForLogMessageWithExpectedValues(streamer.getClass().getSimpleName(), alertInMs)).isTrue();
        }));
    }

    @Test
    public void shouldProcessedUserStreamersAndPersist() throws Exception {
        // Given
        File file = new ClassPathResource("user.csv").getFile();
        String filePath = file.getPath();
        long expectedLinecount = Files.lines(Paths.get(filePath)).count();

        userStreamers.forEach(throwingConsumerWrapper(streamer -> {
            // Given
            userRepositoryService.deleteAll();
            // When
            application.stream(streamer,filePath);
            // Then
            assertThat(userRepositoryService.count()).isEqualTo(expectedLinecount);
        }));
    }

    @Test
    public void shouldProcessedWebUserStreamerAndPersist() throws Exception {
        // Given
        userRepositoryService.deleteAll();
        URI uri = new URI("https://jsonplaceholder.typicode.com/users");

        // When
        userWebLmaxDistruptorStreamer.stream(uri.toURL());

        // Then
        userRepositoryService.findAll().forEach(entity->logger.info(entity.toString()));
        assertThat(userRepositoryService.count()).isGreaterThan(0);
    }

    @Test
    public void shouldLogExceptionWhenCustomApplicationProcessingInvalidFile() {
        // Given
        try {
            String streamer = logMessageStreamers.get(0).getClass().getSimpleName();
            String filePath = "invalid-file-path";

            // When
            MainApplication.main(new String[] {streamer, filePath});

            // Then
            fail("Expected to throw exception, on run");
        } catch (Throwable e) {
            testHelperUtils.verifyLoggedMessage(Level.ERROR, "Error processing filename");
            assertThat(e).isInstanceOf(RuntimeException.class);
        }
    }

    private boolean verifyDBEntryForLogMessageWithExpectedValues(String idPrefix, long alertThreshold) {
        Map<String, Long> messageEventIdDurationLookup = new LinkedHashMap<>();
        messageEventIdDurationLookup.put("testdata-1", 5L);
        messageEventIdDurationLookup.put("testdata-2", 3L);
        messageEventIdDurationLookup.put("testdata-3", 8L);

        return messageEventIdDurationLookup.entrySet()
            .stream()
            .allMatch(entry -> {
                final String entryLookupKey = idPrefix.concat(entry.getKey());
                Optional<LogMessage> logMessageOptional = logRepositoryService.findById(entryLookupKey);
                return logMessageOptional.map(e -> {
                    boolean durationMatched = entry.getValue().equals(e.getDuration());
                    boolean alertMatched = e.isAlert() == (e.getDuration() > alertThreshold);
                    boolean matched = durationMatched & alertMatched;
                    if(!matched) {
                        logger.error("Entry {} not matched expectedDuration {}, expectedAlert {}", entryLookupKey, alertThreshold);
                    }
                    return matched;
                }).orElseGet(() -> {
                    logger.error("Entry {} not found in repository", entryLookupKey);
                    return false;
                });
            });
    }

}