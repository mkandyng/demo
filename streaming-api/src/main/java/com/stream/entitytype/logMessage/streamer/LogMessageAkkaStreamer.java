package com.stream.entitytype.logMessage.streamer;

import com.stream.consumer.MessageConsumer;
import com.stream.stream.AkkaStream;
import com.stream.entitytype.logMessage.LogMessage;
import org.springframework.stereotype.Component;
import java.io.InputStream;

/**
 * Streaming LogMessage with AKKA
 */
@Component
public class LogMessageAkkaStreamer extends LogMessageBaseStreamer {

    @Override
    public void streamData(InputStream inputStream, MessageConsumer<LogMessage> messageConsumer) {
        AkkaStream.from(getIterator(inputStream, messageConsumer), getTransformer())
                    .buffer(getBatchSize())
                    .filter(getFilter())
                    .publish(messageConsumer);
    }
}
