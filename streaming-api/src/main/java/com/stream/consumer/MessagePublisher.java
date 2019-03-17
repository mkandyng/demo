package com.stream.consumer;

import java.util.List;

/**
 *
 * MessagePublisher interface to publish list of entities
 *
 * @param <T>, generic entity type publish by implemented publisher
 *
 */
public interface MessagePublisher<T> {
    void publish(final List<? extends T> entities);
}
