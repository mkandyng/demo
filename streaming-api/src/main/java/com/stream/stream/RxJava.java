package com.stream.stream;

import com.stream.consumer.MessageConsumer;
import com.stream.producer.CloseableStreamIterator;
import rx.Observable;
import java.util.function.Function;

/**
 * A generic entity agnostic RxJava which provide a mechanism to create
 * a RxJava streamer against a particular entity type in a simple to use API
 *
 * @param <T>, input data type
 * @param <R>, target data type, which is going to be an entity for persistent
 */

public class RxJava<T, R> extends BaseReactiveStream<T, R> {

    protected RxJava(CloseableStreamIterator<T> iterator,
                     Function<T, R> transformer) {
        super(iterator, transformer);
    }

    public static<T,R> RxJava<T,R> from(CloseableStreamIterator<T> iterator,
                                        Function<T,R> transformer) {
        return new RxJava<>(iterator, transformer);
    }

    @Override
    public void publish(MessageConsumer<R> messageConsumer) {
        Observable.from(() -> iterator)
                .filter(filter::test)
                .map(transformer::apply)
                .buffer(batchSize)
                .subscribe(element -> element.forEach(messageConsumer::onNext),
                        messageConsumer::onError);
    }
}
