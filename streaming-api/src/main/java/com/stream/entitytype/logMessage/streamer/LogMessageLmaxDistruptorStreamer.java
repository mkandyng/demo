package com.stream.entitytype.logMessage.streamer;

import com.stream.consumer.MessageConsumer;
import com.stream.stream.LmaxDistruptor;
import com.stream.entitytype.logMessage.LogMessage;
import org.springframework.stereotype.Component;
import java.io.InputStream;

/**
 * Streaming LogMessage with Lmax distruptor
 */
@Component
public class LogMessageLmaxDistruptorStreamer extends LogMessageBaseStreamer {
    @Override
    public void streamData(InputStream inputStream, MessageConsumer<LogMessage> messageConsumer) {
        LmaxDistruptor.from(getIterator(inputStream, messageConsumer), getTransformer())
                      .filter(getFilter())
                      .publish(messageConsumer);
    }
}
