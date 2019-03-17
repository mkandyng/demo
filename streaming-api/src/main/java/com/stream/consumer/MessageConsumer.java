package com.stream.consumer;

import java.io.Closeable;

/**
 *
 * MessageConsumer interface to implement reactive interface as per RxJava
 *
 * @param <T>, generic entity type to call publisher to publish
 *
 */
public interface MessageConsumer<T> extends Closeable {
    void onNext(T message);
    void close();
    void onError(Throwable t);
}
