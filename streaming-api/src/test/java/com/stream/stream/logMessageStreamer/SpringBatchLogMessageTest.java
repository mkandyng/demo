package com.stream.stream.logMessageStreamer;

import com.stream.entitytype.logMessage.LogMessage;
import com.stream.entitytype.logMessage.LogMessageRepository;
import com.stream.entitytype.logMessage.streamer.LogMessageSpringBatchStreamer;
import com.stream.stream.StreamerTestDelegate;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.inject.Inject;

@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringBatchLogMessageTest {

    @Inject
    private LogMessageSpringBatchStreamer springBatchJsonStreamer;

    @Inject
    private LogMessageRepository repositoryService;

    @Value("${spring.application.load.test.count}")
    private long loadTestCount;

    @BeforeClass
    public static void beforeClass() {
        System.setProperty("spring.datasource.url", "jdbc:hsqldb:mem:loadTestDB;DB_CLOSE_DELAY=-1");
    }

    @Test
    public void shouldRunLoadTest() throws Exception {
        StreamerTestDelegate<LogMessage, LogMessage, String> delegate = new StreamerTestDelegate<>("logMessage.log", "testdata");
        delegate.loadTest(springBatchJsonStreamer, repositoryService, loadTestCount, loadTestCount * 3);
    }

}
