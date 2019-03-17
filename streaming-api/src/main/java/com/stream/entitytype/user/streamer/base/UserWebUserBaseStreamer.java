package com.stream.entitytype.user.streamer.base;

import com.stream.consumer.EntityRepositoryPublisher;
import com.stream.consumer.MessageConsumer;
import com.stream.consumer.MessagePublisher;
import com.stream.entitytype.logMessage.LogMessageRepository;
import com.stream.entitytype.user.User;
import com.stream.entitytype.user.transformer.UserWebUserTransformer;
import com.stream.producer.CloseableStreamIterator;
import com.stream.producer.DataRecordIterator;
import com.stream.producer.reader.JsonRecordReader;
import com.stream.stream.ResourceStreamer;
import org.springframework.beans.factory.annotation.Qualifier;
import javax.inject.Inject;
import java.io.InputStream;
import java.util.function.Function;

/**
 * Base User streaming adapting streaming of user to user,
 * note, the JSON received from the web already converted to User via JsonIterator
 */

public abstract class UserWebUserBaseStreamer extends ResourceStreamer<User, User> {

    @Inject
    LogMessageRepository userMessageRepository;

    @Inject
    @Qualifier("userWebUserTransformer")
    UserWebUserTransformer userWebUserTransformer;

    @Override
    public MessagePublisher<User> getPublisher() {
        return new EntityRepositoryPublisher<>(userMessageRepository);
    }

    @Override
    public Function<User, User> getTransformer() {
        return userWebUserTransformer;
    }

    @Override
    public CloseableStreamIterator<User> getIterator(InputStream inputStream, MessageConsumer<User> messageConsumer) {
        return new DataRecordIterator<>(new JsonRecordReader<>(inputStream, User.class),
                                         messageConsumer::onError);
    }
}
