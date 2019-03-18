package com.stream.stream;

import com.stream.consumer.MessageConsumer;
import com.stream.producer.CloseableStreamIterator;

import java.util.Iterator;
import java.util.function.Function;
import java.util.function.Predicate;

/**
 * Base class to create an entity agnostic Streaming solution which provide a mechanism to create
 * a streamer against a particular entity type in a simple to use API
 *
 * @param <T>, input data type
 * @param <R>, target data type, which is going to be an entity for persistent
 */

public abstract class BaseReactiveStream<T, R> {
    protected final CloseableStreamIterator<T> iterator;
    protected final Function<T,R> transformer;
    protected Predicate<T> filter;
    protected int batchSize;

    protected BaseReactiveStream(CloseableStreamIterator<T> iterator,
                                 Function<T,R> transformer) {
        this.iterator = iterator;
        this.transformer = transformer;
        this.filter = e->true;
        this.batchSize = 1;
    }

    public BaseReactiveStream<T,R> filter(Predicate<T> filter) {
        this.filter = filter;
        return this;
    }

    public BaseReactiveStream<T,R> batchSize(int batchSize) {
        this.batchSize = batchSize;
        return this;
    }

    public abstract void publish(MessageConsumer<R> messageConsumer);
}
