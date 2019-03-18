package com.stream.entitytype.logMessage.streamer;

import com.stream.consumer.MessageConsumer;
import com.stream.entitytype.logMessage.LogMessage;
import com.stream.stream.Reactor;
import org.springframework.stereotype.Component;

import java.io.InputStream;

/**
 * Streaming LogMessage with Reactor
 */
@Component
public class LogMessageReactorStreamer extends LogMessageBaseStreamer {

    @Override
    public void streamData(InputStream inputStream, MessageConsumer<LogMessage> messageConsumer) {
        Reactor.from(getIterator(inputStream, messageConsumer), getTransformer())
                    .batchSize(getBatchSize())
                    .filter(getFilter())
                    .publish(messageConsumer);
    }
}
