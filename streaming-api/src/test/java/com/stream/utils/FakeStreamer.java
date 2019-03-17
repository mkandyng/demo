package com.stream.utils;

import com.stream.consumer.MessageConsumer;
import com.stream.consumer.MessagePublisher;
import com.stream.consumer.MessagePublishingConsumer;
import com.stream.stream.ResourceStreamer;

import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.Properties;
import java.util.function.Function;
import java.util.function.Predicate;

public class FakeStreamer<T,R> extends ResourceStreamer<T,R> {
    private final ResourceStreamer<T,R> streamer;
    private final FakePublisher<R> publisher;
    private final Properties appProperties;

    public FakeStreamer(ResourceStreamer<T,R> streamer) throws IOException {
        this.streamer = streamer;
        this.publisher = new FakePublisher<>();
        this.appProperties = new Properties();
        this.appProperties.load(getClass().getResource("/test.properties").openStream());
    }

    @Override
    @SuppressWarnings("unchecked")
    public MessageConsumer<R> getMessageConsumer() {
        return new MessagePublishingConsumer<>(publisher, getThreadPoolSize())
                        .dequeueFrequence(getDequeueFrequency())
                        .batchSize(getBatchSize());
    }

    @Override
    public void streamData(InputStream inputStream, MessageConsumer<R> messageConsumer) throws Exception {
        streamer.streamData(inputStream, messageConsumer);
    }

    public long getPublishedCount() {
        return publisher.getTotal();
    }

    @Override
    public int getBatchSize() {
        return Integer.parseInt((String) appProperties.get("spring.jpa.properties.hibernate.jdbc.batch_size"));
    }

    @Override
    public int getThreadPoolSize() {
        return Integer.parseInt((String) appProperties.get("spring.application.threadPoolSize"));
    }

    @Override
    public long getDequeueFrequency() {
        return Long.parseLong((String) appProperties.get("spring.application.dequeueFrequence"));
    }

    @Override
    public MessagePublisher<R> getPublisher() {
        return publisher;
    }

    @Override
    public Predicate<T> getFilter() {
        return null;
    }

    @Override
    public Function<T, R> getTransformer() {
        return null;
    }

    @Override
    public Iterator<T> getIterator(InputStream inputStream, MessageConsumer<R> messageConsumer) {
        return null;
    }
}
