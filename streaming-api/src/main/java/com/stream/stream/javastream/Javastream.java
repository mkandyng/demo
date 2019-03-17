package com.stream.stream.javastream;

import com.stream.consumer.MessageConsumer;
import com.stream.stream.javastream.Spliterator.InputStreamSpliterator;
import java.util.Iterator;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * A generic entity agnostic Javastream which provide a mechanism to create
 * a Javastream streamer against a particular entity type in a simple to use API
 *
 * @param <T>, input data type
 * @param <R>, target data type, which is going to be an entity for persistent
 */
public final class Javastream<T,R>  {
    private final Iterator<T> iterator;
    private final Function<T,R> transformer;
    private Predicate<T> filter;
    private int batchSize;

    private Javastream(Iterator<T> iterator,
                       Function<T,R> transformer) {
        this.iterator = iterator;
        this.transformer =  transformer;
        this.filter = e->true;
        this.batchSize = 1;
    }

    public static<T,R> Javastream<T,R> from(Iterator<T> iterator,
                                            Function<T,R> transformer) {
        return new Javastream<>(iterator, transformer);
    }

    public Javastream<T,R> filter(Predicate<T> filter) {
        this.filter = filter;
        return this;
    }

    public Javastream<T,R> batchSize(int batchSize) {
        this.batchSize = batchSize;
        return this;
    }

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
