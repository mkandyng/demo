package com.stream.utils;

import org.junit.Test;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * OptionalConsumerTest, test the two possible condition
 */
public class OptionalConsumerTest {

    @Test
    public void shouldRunCodeIfPresent() {
        List<String> list = new ArrayList<>();
        OptionalConsumer.of(Optional.of("dd"))
                        .ifPresent(list::add);
        assertThat(list.isEmpty()).isFalse();
    }

    @Test
    public void shouldRunCodeIfNotPresent() {
        List<String> list = new ArrayList<>();
        OptionalConsumer.of(Optional.empty())
                .ifNotPresent(() -> list.add("ee"));
        assertThat(list.isEmpty()).isFalse();
    }

}
