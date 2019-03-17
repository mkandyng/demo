package com.stream.stream;


import com.stream.consumer.MessageConsumer;
import com.lmax.disruptor.RingBuffer;
import com.lmax.disruptor.dsl.Disruptor;
import com.lmax.disruptor.util.DaemonThreadFactory;
import java.util.Iterator;
import java.util.Optional;
import java.util.Spliterators;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * A generic entity agnostic LmaxDistruptor which provide a mechanism to create
 * a LmaxDistruptor streamer against a particular entity type in a simple to use API
 *
 * @param <T>, input data type
 * @param <R>, target data type, which is going to be an entity for persistent
 */

public class LmaxDistruptor<T,R> {
    private final Iterator<T> iterator;
    private final Function<T,R> transformer;
    private Predicate<T> filter;
    private int batchSize;

    private LmaxDistruptor(Iterator<T> iterator,
                           Function<T,R> transformer) {
        this.iterator = iterator;
        this.filter = e->true;
        this.transformer =  transformer;
        // Specify the size of the ring buffer, must be power of 2
        this.batchSize = 1;
    }

    public static<T,R> LmaxDistruptor<T,R> from(Iterator<T> iterator, Function<T,R> transformer) {
        return new LmaxDistruptor<>(iterator, transformer);
    }

    public LmaxDistruptor<T,R> filter(Predicate<T> filter) {
        this.filter = filter;
        return this;
    }

    public LmaxDistruptor<T,R> batchSize(int batchSize) {
        this.batchSize = batchSize;
        return this;
    }

    public void publish(MessageConsumer<R> messageConsumer) {
        // Construct the Disruptor
        Disruptor<MessageEventHolder> disruptor = null;
        try {
            disruptor = new Disruptor<>(MessageEventHolder::new, batchSize, DaemonThreadFactory.INSTANCE);
            // Connect the handler
            disruptor.handleEventsWith((event, sequence, endOfBatch) -> messageConsumer.onNext(event.get()));

            // Start the Disruptor, starts all threads running
            disruptor.start();

            // Get the ring buffer from the Disruptor to be used for publishing.
            RingBuffer<MessageEventHolder> ringBuffer = disruptor.getRingBuffer();

            Stream<T> streamer = getStream(messageConsumer);
            streamer.filter(filter)
                    .map(transformer)
                    .forEach(message -> ringBuffer.publishEvent((event, sequence) -> event.set(message)));
        } finally {
            if(disruptor != null) {
                disruptor.shutdown();
            }
        }
    }

    private Stream<T> getStream(MessageConsumer messageConsumer) {
        return StreamSupport.stream(Spliterators.spliteratorUnknownSize(
                iterator, 0), false).onClose(()->{});
    }

    private class MessageEventHolder
    {
        private R value;

        public void set(R value)
        {
            this.value = value;
        }

        public R get() {
            return value;
        }
    }
}
