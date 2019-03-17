package com.stream.utils;

import org.junit.Test;

import java.io.IOException;
import java.util.function.Consumer;

import static com.stream.utils.ThrowingConsumer.throwingConsumerWrapper;

/**
 * Test that wrapper will propogate exception back
 */

public class ThrowingConsumerTest {

    @Test(expected = RuntimeException.class)
    public void shouldThrowExceptionToParentMethod() {
        Consumer<String> consumer =
                throwingConsumerWrapper(e-> {
                    throw new IOException();
                });
        consumer.accept("ee");
    }

}
