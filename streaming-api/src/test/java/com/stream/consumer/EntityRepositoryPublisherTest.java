package com.stream.consumer;

import org.junit.Before;
import org.junit.Test;
import org.springframework.data.repository.CrudRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

/**
 *
 *  EntityRepositoryPublisherTest to verify the behaviour when its
 *  publish method from the MessagePublisher interface is being called
 *
 */

public class EntityRepositoryPublisherTest {

    private MessagePublisher<String> publisher;

    private CrudRepository repository;

    @Before
    public void setup() {
        repository = mock(CrudRepository.class);
        publisher = new EntityRepositoryPublisher<>(repository);
    }

    @Test
    public void shouldSaveAllWhenPublish() {

        // Given
        List<String> strings = new ArrayList<>(Arrays.asList("test"));

        // When
        publisher.publish(strings);

        // Then
        verify(repository).saveAll(strings);
    }
}
