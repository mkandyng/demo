package com.stream.stream.logMessageStreamer;

import com.stream.entitytype.logMessage.LogMessage;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.logMessage.streamer.LogMessageAkkaStreamer;
import org.junit.BeforeClass;

import javax.inject.Inject;

public class AkkaLogMessageTest extends AbstractLogMessageTestStreamer {

    @BeforeClass
    public static void beforeClass() {
        System.setProperty("spring.datasource.url", "jdbc:hsqldb:mem:loadTestDB;DB_CLOSE_DELAY=-1");
        System.setProperty("spring.jmx.enabled", "false");
    }

    @Inject
    private LogMessageAkkaStreamer streamer;

    @Override
    public ResourceStreamer<LogMessage, LogMessage> getStreamer() {
        return streamer;
    }
}
