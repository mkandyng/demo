package com.stream.stream.logMessageStreamer;

import com.stream.entitytype.logMessage.LogMessage;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.logMessage.streamer.LogMessageJavastreamStreamer;
import javax.inject.Inject;

public class JavastreamLogMessageTest extends AbstractLogMessageTestStreamer {
    @Inject
    private LogMessageJavastreamStreamer streamer;

    @Override
    public ResourceStreamer<LogMessage,LogMessage> getStreamer() {
        return streamer;
    }
}
