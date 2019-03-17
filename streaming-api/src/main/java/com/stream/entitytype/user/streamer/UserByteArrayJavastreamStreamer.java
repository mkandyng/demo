package com.stream.entitytype.user.streamer;

import com.stream.consumer.MessageConsumer;
import com.stream.entitytype.user.User;
import com.stream.entitytype.user.streamer.base.UserByteArrayBaseStreamer;
import com.stream.stream.javastream.Javastream;
import org.springframework.stereotype.Component;

import java.io.InputStream;

/**
 * Associate the User input data type to actual Java stream implementation
 */

@Component
public class UserByteArrayJavastreamStreamer extends UserByteArrayBaseStreamer {

    @Override
    public void streamData(InputStream inputStream, MessageConsumer<User> messageConsumer) {
        Javastream.from(getIterator(inputStream, messageConsumer), getTransformer())
                          .batchSize(getBatchSize())
                          .publish(messageConsumer);
    }
}
