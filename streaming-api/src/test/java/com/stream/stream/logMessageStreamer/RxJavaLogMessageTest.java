package com.stream.stream.logMessageStreamer;

import com.stream.entitytype.logMessage.LogMessage;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.logMessage.streamer.LogMessageRxJavaStreamer;
import javax.inject.Inject;

public class RxJavaLogMessageTest extends AbstractLogMessageTestStreamer {

    @Inject
    private LogMessageRxJavaStreamer streamer;

    @Override
    public ResourceStreamer<LogMessage, LogMessage> getStreamer() {
        return streamer;
    }
}
