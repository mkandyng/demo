package com.stream.stream;

import com.stream.consumer.MessageConsumer;
import rx.Observable;
import java.util.Iterator;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;

/**
 * A generic entity agnostic RxJava which provide a mechanism to create
 * a RxJava streamer against a particular entity type in a simple to use API
 *
 * @param <T>, input data type
 * @param <R>, target data type, which is going to be an entity for persistent
 */

public class RxJava<T, R> {
    private final Iterator<T> iterator;
    private final Function<T,R> transformer;
    private Predicate<T> filter;
    private int batchSize;

    private RxJava(Iterator<T> iterator,
                   Function<T,R> transformer) {
        this.iterator = iterator;
        this.transformer = transformer;
        this.filter = e->true;
        this.batchSize = 1;
    }

    public static<T,R> RxJava<T,R> from(Iterator<T> iterator, Function<T,R> transformer) {
        return new RxJava<>(iterator, transformer);
    }

    public RxJava<T,R> filter(Predicate<T> filter) {
        this.filter = filter;
        return this;
    }

    public RxJava<T,R> batchSize(int batchSize) {
        this.batchSize = batchSize;
        return this;
    }

    public void publish(MessageConsumer<R> messageConsumer) {
        Observable.from(() -> iterator)
                .filter(filter::test)
                .map(transformer::apply)
                .buffer(batchSize)
                .subscribe(element -> element.forEach(messageConsumer::onNext),
                        messageConsumer::onError);
    }
}
