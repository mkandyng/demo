package com.stream.stream.logMessageStreamer;

import com.stream.entitytype.logMessage.LogMessage;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.logMessage.streamer.LogMessageLmaxDistruptorStreamer;

import javax.inject.Inject;

public class LmaxDistruptorLogMessageTest extends AbstractLogMessageTestStreamer {

    @Inject
    private LogMessageLmaxDistruptorStreamer streamer;

    @Override
    public ResourceStreamer<LogMessage, LogMessage> getStreamer() {
        return streamer;
    }
}
