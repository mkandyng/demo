package com.stream.entitytype.user.streamer;

import com.stream.consumer.MessageConsumer;
import com.stream.entitytype.user.streamer.base.UserStringBaseStreamer;
import com.stream.stream.RxJava;
import com.stream.entitytype.user.User;
import org.springframework.stereotype.Component;
import java.io.InputStream;

/**
 * Associate the User input data type to actual RxJava stream implementation
 */

@Component
public class UserStringRxJavaStreamer extends UserStringBaseStreamer {

    @Override
    public void streamData(InputStream inputStream, MessageConsumer<User> messageConsumer) {
        RxJava.from(getIterator(inputStream, messageConsumer), getTransformer())
                .batchSize(getBatchSize())
                .publish(messageConsumer);
    }
}
