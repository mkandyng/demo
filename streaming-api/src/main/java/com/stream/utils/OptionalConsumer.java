package com.stream.utils;

import java.util.Optional;
import java.util.function.Consumer;

/**
 *
 * This class provide an implementation to allow Optional to run when
 * a given optional value is Not Present. Need to implement this as
 * the code is compiling to java 8.
 *
 * @param <T>, a given Optional
 */
@SuppressWarnings("OptionalUsedAsFieldOrParameterType")
public class OptionalConsumer<T> {
    private final Optional<T> optional;

    private OptionalConsumer(Optional<T> optional) {
        this.optional = optional;
    }

    public static <T> OptionalConsumer<T> of(Optional<T> optional) {
        return new OptionalConsumer<>(optional);
    }

    public OptionalConsumer<T> ifPresent(Consumer<T> c) {
        optional.ifPresent(c);
        return this;
    }

    public OptionalConsumer<T> ifNotPresent(Runnable r) {
        if (!optional.isPresent()) {
            r.run();
        }
        return this;
    }
}
