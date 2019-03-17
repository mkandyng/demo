package com.stream;

import com.stream.stream.ResourceStreamer;
import com.stream.utils.OptionalConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import javax.inject.Inject;
import java.io.File;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.stream.utils.ThrowingConsumer.throwingConsumerWrapper;

/**
 * Boot strap SpringBootApplication that process <fileInputStreamer> <inputFilePath>
 */

@SpringBootApplication
public class MainApplication implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(MainApplication.class);

    @Inject
    @Qualifier("fileStreamers")
    private List<ResourceStreamer> fileStreamers;

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }

    @Override
    public void run(String... args) {
        String filestreamer = resolveInputArgument(0, "stream", args);
        String resourceURL = resolveInputArgument(1, "inputFile", args);
        if(filestreamer != null && resourceURL != null) {
            OptionalConsumer.of(getStreamer(filestreamer))
                            .ifPresent(throwingConsumerWrapper(streamer->stream(streamer, resourceURL)))
                            .ifNotPresent(()->{
                                throw new IllegalArgumentException(generateErrorText(filestreamer));
                            });
        } else {
            logger.info("Usage: runWith <fileInputStreamer> <inputFilePath>");
            logger.info("Valid streamers: " + fileStreamers.stream()
                         .map(e->e.getClass().getSimpleName())
                         .collect(Collectors.joining(",")));
        }
    }

    public void stream(ResourceStreamer streamer, String resourceURL) throws MalformedURLException {
        URL url = null;
        if(!resourceURL.startsWith("http")) {
            File testFile = new File(resourceURL);
            URI uri = testFile.toURI();
            url = uri.toURL();
        }
        streamer.stream(url);
    }

    private String generateErrorText(String filestreamer) {
        return String.format("Invalid filestreamer [%s], please check against a valid entry %s", filestreamer,
                fileStreamers.stream().map(s->s.getClass().getSimpleName()).collect(Collectors.toList()));
    }

    private Optional<ResourceStreamer> getStreamer(String filestreamer) {
        return fileStreamers.stream()
                     .filter(streamer->streamer.getClass().getSimpleName().equals(filestreamer))
                     .findAny();
    }

    private String resolveInputArgument(int index, String propertyName, String... args) {
        if(args.length >= index+1) {
            return args[index];
        } else {
            return System.getProperty(propertyName);
        }
    }
}
