package com.stream.stream.javastream;

import com.stream.consumer.MessageConsumer;
import com.stream.producer.CloseableStreamIterator;
import com.stream.stream.BaseReactiveStream;
import com.stream.stream.javastream.Spliterator.InputStreamSpliterator;
import java.util.Iterator;
import java.util.function.Function;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * A generic entity agnostic Javastream which provide a mechanism to create
 * a Javastream streamer against a particular entity type in a simple to use API
 *
 * @param <T>, input data type
 * @param <R>, target data type, which is going to be an entity for persistent
 */
public final class Javastream<T,R> extends BaseReactiveStream<T,R> {

    protected Javastream(CloseableStreamIterator<T> iterator,
                         Function<T, R> transformer) {
        super(iterator, transformer);
    }

    public static<T,R> Javastream<T,R> from(CloseableStreamIterator<T> iterator,
                                            Function<T,R> transformer) {
        return new Javastream<>(iterator, transformer);
    }

    @Override
    public void publish(MessageConsumer<R> messageConsumer) {
        Stream<T> stream = getStream(messageConsumer);
        stream.parallel().filter(filter)
                         .map(transformer)
                         .forEach(messageConsumer::onNext);
    }

    private Stream<T> getStream(MessageConsumer<R> messageConsumer) {
        return StreamSupport.stream(
                            new InputStreamSpliterator<>(iterator, batchSize),
                            false).onClose(messageConsumer::close);
    }
}
