package com.stream.utils;

import com.stream.consumer.MessagePublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.concurrent.atomic.LongAccumulator;
import java.util.concurrent.atomic.LongAdder;

public class FakePublisher<R> implements MessagePublisher<R> {

    private static final Logger logger = LoggerFactory.getLogger(FakePublisher.class);

    private final LongAccumulator counter = new LongAccumulator(Long::sum, 0L);
    private final LongAdder adder = new LongAdder();

    @Override
    public void publish(final List<? extends R> entities) {
        counter.accumulate(entities.size());
        adder.increment();
        logger.info("{} batch {}, total {}", getClass().getSimpleName(), entities.size(), counter.get());
    }

    public long getTotal() {
        return counter.get();
    }
}
