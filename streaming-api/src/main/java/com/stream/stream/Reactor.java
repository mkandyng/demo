package com.stream.stream;

import com.stream.consumer.MessageConsumer;
import com.stream.producer.CloseableStreamIterator;
import reactor.core.publisher.Flux;
import java.util.function.Function;

/**
 * A generic entity agnostic Reactor which provide a mechanism to create
 * a Reactor streamer against a particular entity type in a simple to use API
 *
 * @param <T>, input data type
 * @param <R>, target data type, which is going to be an entity for persistent
 *
 */

public class Reactor<T, R> extends BaseReactiveStream<T, R> {

    private Reactor(CloseableStreamIterator<T> iterator,
                    Function<T, R> transformer) {
        super(iterator, transformer);
    }

    public static<T,R> Reactor<T,R> from(CloseableStreamIterator<T> iterator,
                                         Function<T,R> transformer) {
        return new Reactor<>(iterator, transformer);
    }

    @Override
    public void publish(MessageConsumer<R> messageConsumer) {
        Flux.fromIterable(() -> iterator)
                .filter(filter::test)
                .map(transformer::apply)
                .buffer(batchSize)
                .subscribe(element -> element.forEach(messageConsumer::onNext),
                        messageConsumer::onError);
    }
}
