package com.stream.stream;

import com.stream.utils.FakeStreamer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.repository.CrudRepository;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * MainApplication End2EndTest of the spring boot application, given an inputLogFile
 *
 * @author andy.ng@test.io
 *
 */

public class StreamerTestDelegate<T,R,I> {

    private static final Logger logger = LoggerFactory.getLogger(StreamerTestDelegate.class);

    private final static String NOT_REPLACE = "NOT_REPLACE";
    private final String testFileName;
    private final String idReplacement;

    public StreamerTestDelegate(String testFileName) {
        this(testFileName, NOT_REPLACE);
    }

    public StreamerTestDelegate(String testFileName, String idReplacement) {
        this.testFileName = testFileName;
        this.idReplacement = idReplacement;
    }

    public void loadTest(ResourceStreamer<T,R> streamer,
                         CrudRepository<R, I> repositoryService,
                         long loadCount,
                         long expectedCount) throws Exception {
        // Given
        long MAX_REAL_CONSUMER_PERSIST_TO_MEMDB_CAN_HANDLE_IN_TEST=100000;
        repositoryService.deleteAll();
        File tempFile = readInputFileAndWriteToTempFile(loadCount);

        // When
        if(loadCount < MAX_REAL_CONSUMER_PERSIST_TO_MEMDB_CAN_HANDLE_IN_TEST) {
            testWithRealConsumer(streamer, repositoryService, tempFile, expectedCount);
        } else {
            testWithFakeConsumer(streamer, tempFile, expectedCount);
        }
    }

    private void testWithRealConsumer(ResourceStreamer<T,R> streamer,
                                      CrudRepository<R, I>  repositoryService,
                                      File loadFile, long expectedCount) throws MalformedURLException {
        // Given
        // stream

        // When
        streamer.stream(convertToURL(loadFile.getAbsolutePath()));
        assertThat(repositoryService.count()).isEqualTo(expectedCount);
    }

    private void testWithFakeConsumer(ResourceStreamer<T,R> streamer, File loadFile, long expectedCount) throws IOException {
        // Given
        FakeStreamer mockStreamer = new FakeStreamer<>(streamer);
        long start = System.nanoTime();

        // When
        mockStreamer.stream(convertToURL(loadFile.getAbsolutePath()));
        long finished = System.nanoTime() - start;
        logger.info("Total time take to process {} is {} ms, {} seconds",
                mockStreamer.getPublishedCount(),
                TimeUnit.NANOSECONDS.toMillis(finished ),
                TimeUnit.NANOSECONDS.toSeconds(finished ));

        // Then, equal to 3 times of total count as each file of 3 unique id
        assertThat(mockStreamer.getPublishedCount()).isEqualTo(expectedCount);
    }


    private File readInputFileAndWriteToTempFile(long repeat) throws IOException, URISyntaxException {
        File tempFile = File.createTempFile("test", ".log");
        tempFile.deleteOnExit();
        logger.info("Generate load from test file {} to temp file {}", testFileName, tempFile.getName());
        URL resourceURL = getClass().getClassLoader().getResource(testFileName);
        if(resourceURL == null) {
            throw new IOException(String.format("Resource %s not found", testFileName));
        }
        Path inputFilepath = Paths.get(resourceURL.toURI());
        try (Stream<String> linestream = Files.lines(inputFilepath);
             FileWriter fstream = new FileWriter(tempFile, true);
             BufferedWriter out = new BufferedWriter(fstream)
        ) {
            List<String> lines = linestream.collect(Collectors.toList());
            for (int i = 0; i < repeat; i++) {
                for (String line : lines) {
                    out.write(line.replace(idReplacement, i + "-" + idReplacement)
                                  .replaceAll("replace", ""+ i));
                    out.write(System.lineSeparator());
                }
            }
        }
        return tempFile;
    }

    private URL convertToURL(String resourceURL) throws MalformedURLException {
        URL url = null;
        if(!resourceURL.startsWith("http")) {
            File testFile = new File(resourceURL);
            URI uri = testFile.toURI();
            url = uri.toURL();
        }
        return url;
    }

    private void checkData(List<String> lines) {
        for (String line: lines) {
            if(!idReplacement.equals(NOT_REPLACE) && !line.contains(idReplacement)){
                throw new RuntimeException(String.format("Test file do not have id column %s to replace, please check", idReplacement));
            }
        }
    }
}