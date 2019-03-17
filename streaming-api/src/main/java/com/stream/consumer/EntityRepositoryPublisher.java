package com.stream.consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.LongAccumulator;

/**
 *
 * EntityRepositoryPublisher is a generic class to delegate actual persistent
 * to the given crud JPA repository. Note, CrudRepository is an interface which
 * is wired up by Springboot to associate a given entity
 *
 * @param <T>, generic entity type to persist by the target repository
 *
 */
public class EntityRepositoryPublisher<T> implements MessagePublisher<T> {
    private static final Logger logger = LoggerFactory.getLogger(EntityRepositoryPublisher.class);

    private final CrudRepository repository;
    private final LongAccumulator accumulator;

    public EntityRepositoryPublisher(final CrudRepository repository) {
        this.repository = repository;
        this.accumulator = new LongAccumulator(Long::sum,0L);
    }

    @Transactional
    public void publish(final List<? extends T> entities) {
        repository.saveAll(entities);
        accumulator.accumulate(entities.size());
        logger.info("Successfully streamed {} batch entities, accumulating total {}",
                entities.size(), accumulator.get());
    }
}
