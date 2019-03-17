package com.stream.entitytype.logMessage.streamer;

import com.stream.consumer.MessageConsumer;
import com.stream.stream.javastream.Javastream;
import com.stream.entitytype.logMessage.LogMessage;
import org.springframework.stereotype.Component;
import java.io.InputStream;

/**
 * Streaming LogMessage with Java stream
 */
@Component
public class LogMessageJavastreamStreamer extends LogMessageBaseStreamer {

    @Override
    public void streamData(InputStream inputStream, MessageConsumer<LogMessage> messageConsumer) {
        Javastream.from(getIterator(inputStream, messageConsumer),getTransformer())
                    .batchSize(getBatchSize())
                    .filter(getFilter())
                    .publish(messageConsumer);
    }
}
