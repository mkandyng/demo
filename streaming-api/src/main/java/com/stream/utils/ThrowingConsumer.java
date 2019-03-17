package com.stream.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.function.Consumer;

/**
 *
 * This class allow wrapping of Lambda expression that throws checked exception.
 * It allows a more elegant approach so that it re throw as runtime exception so that
 * it can be handle outside of the lamdbda
 *
 * @param <T>
 * @param <E>
 */
@FunctionalInterface
public interface ThrowingConsumer<T, E extends Exception> {
    Logger logger = LoggerFactory.getLogger(ThrowingConsumer.class);
    void accept(T t) throws E;

    static <T, E extends Exception> Consumer<T> throwingConsumerWrapper(
            ThrowingConsumer<T, E> throwingConsumer) {
        return i -> {
            try {
                throwingConsumer.accept(i);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        };
    }
}

