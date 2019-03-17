package com.stream.entitytype.user.streamer.base;

import com.stream.consumer.EntityRepositoryPublisher;
import com.stream.consumer.MessageConsumer;
import com.stream.entitytype.user.UserRepository;
import com.stream.producer.CloseableStreamIterator;
import com.stream.producer.DataRecordIterator;
import com.stream.producer.reader.StringRecordReader;
import com.stream.consumer.MessagePublisher;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.user.User;
import com.stream.entitytype.user.transformer.UserStringTransformer;
import org.springframework.beans.factory.annotation.Qualifier;

import javax.inject.Inject;
import java.io.InputStream;
import java.util.function.Function;

/**
 * Base User streaming adapting streaming of string in CSV format to User
 */

public abstract class UserStringBaseStreamer extends ResourceStreamer<String, User> {

    @Inject
    UserRepository userRepository;

    @Inject
    @Qualifier("userStringTransformer")
    public UserStringTransformer userStringTransformer;

    @Override
    public MessagePublisher<User> getPublisher() {
        return new EntityRepositoryPublisher<>(userRepository);
    }

    @Override
    public Function<String, User> getTransformer() {
        return userStringTransformer;
    }

    @Override
    public CloseableStreamIterator<String> getIterator(InputStream inputStream, MessageConsumer<User> messageConsumer) {
        return new DataRecordIterator<>(new StringRecordReader(inputStream), messageConsumer::onError);
    }
}
