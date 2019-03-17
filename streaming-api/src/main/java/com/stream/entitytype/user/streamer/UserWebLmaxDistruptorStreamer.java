package com.stream.entitytype.user.streamer;

import com.stream.consumer.MessageConsumer;
import com.stream.entitytype.user.User;
import com.stream.entitytype.user.streamer.base.UserWebUserBaseStreamer;
import com.stream.stream.LmaxDistruptor;
import org.springframework.stereotype.Component;

import java.io.InputStream;

/**
 *
 *  Associate the User input data type to actual LmaxDistruptor implementation
 */
@Component
public class UserWebLmaxDistruptorStreamer extends UserWebUserBaseStreamer {

    @Override
    public void streamData(InputStream inputStream, MessageConsumer<User> messageConsumer) {
        LmaxDistruptor.from(getIterator(inputStream, messageConsumer), getTransformer())
                        .batchSize(getBatchSize())
                        .publish(messageConsumer);
    }
}
