package com.stream.entitytype.logMessage.streamer;

import com.stream.consumer.MessageConsumer;
import com.stream.stream.RxJava;
import com.stream.entitytype.logMessage.LogMessage;
import org.springframework.stereotype.Component;
import java.io.InputStream;

/**
 * Streaming message with RxJava
 */
@Component
public class LogMessageRxJavaStreamer extends LogMessageBaseStreamer {
    @Override
    public void streamData(InputStream inputStream, MessageConsumer<LogMessage> messageConsumer) {
        RxJava.from(getIterator(inputStream, messageConsumer),getTransformer())
                .filter(getFilter())
                .publish(messageConsumer);
    }
}
