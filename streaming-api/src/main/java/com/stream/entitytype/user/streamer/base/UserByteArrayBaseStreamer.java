package com.stream.entitytype.user.streamer.base;

import com.stream.consumer.EntityRepositoryPublisher;
import com.stream.consumer.MessageConsumer;
import com.stream.consumer.MessagePublisher;
import com.stream.entitytype.user.UserRepository;
import com.stream.producer.DataRecordIterator;
import com.stream.producer.reader.BytesArrayRecordReader;
import com.stream.producer.CloseableStreamIterator;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.user.User;
import org.springframework.beans.factory.annotation.Qualifier;
import javax.inject.Inject;
import java.io.InputStream;
import java.util.function.Function;

/**
 * Base User streaming adapting streaming of byte array to user
 */
public abstract class UserByteArrayBaseStreamer extends ResourceStreamer<byte[], User> {

    @Inject
    UserRepository userRepository;

    @Inject
    @Qualifier("userByteArrayTransformer")
    public Function<byte[], User> userByteArrayTransformer;

    @Override
    public Function<byte[], User> getTransformer() {
        return userByteArrayTransformer;
    }

    @Override
    public MessagePublisher<User> getPublisher() {
        return new EntityRepositoryPublisher<>(userRepository);
    }

    @Override
    public CloseableStreamIterator<byte[]> getIterator(InputStream inputStream, MessageConsumer<User> messageConsumer) {
        return new DataRecordIterator<>(new BytesArrayRecordReader(inputStream), messageConsumer::onError);
    }
}
