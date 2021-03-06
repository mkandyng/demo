package com.stream.stream.logMessageStreamer;

import com.stream.entitytype.logMessage.LogMessage;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.logMessage.streamer.LogMessageAkkaStreamer;
import org.junit.BeforeClass;

import javax.inject.Inject;

public class AkkaLogMessageTest extends AbstractLogMessageTestStreamer {

    @Inject
    private LogMessageAkkaStreamer streamer;

    @Override
    public ResourceStreamer<LogMessage, LogMessage> getStreamer() {
        return streamer;
    }
}
