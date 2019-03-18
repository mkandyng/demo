package com.stream.stream.javastream.Spliterator;

import static java.util.Spliterators.spliterator;

import java.util.Comparator;
import java.util.Spliterator;
import java.util.function.Consumer;

/**
 * Implement Splitter to support parallel processing of java stream on file read.
 * @param <T>
 */
public abstract class AbstractBatchSpliterator<T> implements Spliterator<T> {
    private final int batchSize;
    private final int characteristics;
    private long estimateSize;

    public AbstractBatchSpliterator(int characteristics, int batchSize, long estimateSize) {
        this.characteristics = characteristics | SUBSIZED;
        this.batchSize = batchSize;
        this.estimateSize = estimateSize;
    }
    public AbstractBatchSpliterator(int characteristics, int batchSize) {
        this(characteristics, batchSize, Long.MAX_VALUE);
    }

    @Override public Spliterator<T> trySplit() {
        final MessageConsumer holder = new MessageConsumer();
        if (!tryAdvance(holder)) {
            return null;
        }

        final Object[] batches = new Object[batchSize];

        int batchCounter = 0;

        do {
            batches[batchCounter] = holder.getValue();
        } while (++batchCounter < batchSize && tryAdvance(holder));

        estimateSize = estimateSize - batchCounter;

        return spliterator(batches, 0, batchCounter, characteristics() | SIZED);
    }

    @Override public Comparator<? super T> getComparator() {
        if (hasCharacteristics(SORTED)) {
            return null;
        }
        throw new IllegalStateException();
    }

    @Override public long estimateSize() {
        return estimateSize;
    }

    @Override public int characteristics() {
        return characteristics;
    }

    private final class MessageConsumer implements Consumer<T> {
        private Object message;
        @Override
        public void accept(T message) {
            this.message = message;
        }
        Object getValue() {
            return message;
        }
    }
}
