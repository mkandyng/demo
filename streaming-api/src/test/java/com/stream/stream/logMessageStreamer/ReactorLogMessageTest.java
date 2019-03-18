package com.stream.stream.logMessageStreamer;

import com.stream.entitytype.logMessage.LogMessage;
import com.stream.entitytype.logMessage.streamer.LogMessageReactorStreamer;
import com.stream.stream.ResourceStreamer;

import javax.inject.Inject;

public class ReactorLogMessageTest extends AbstractLogMessageTestStreamer {

    @Inject
    private LogMessageReactorStreamer streamer;

    @Override
    public ResourceStreamer<LogMessage, LogMessage> getStreamer() {
        return streamer;
    }
}
