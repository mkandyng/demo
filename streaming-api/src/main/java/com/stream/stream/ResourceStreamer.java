package com.stream.stream;

import com.stream.consumer.MessageConsumer;
import com.stream.consumer.MessagePublishingConsumer;
import com.stream.consumer.MessagePublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import java.io.InputStream;
import java.net.URL;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.function.Predicate;

/**
 * A generic base class providing templating for creating a streaming solution,
 * adapting to any streaming technology and entity type
 * @param <T>
 * @param <R>
 */
public abstract class ResourceStreamer<T,R> {

    protected final Logger logger = LoggerFactory.getLogger(getClass());

    @Value("${spring.application.threadPoolSize}")
    private int threadPoolSize;

    @Value("${spring.application.dequeueFrequence}")
    private long dequeueFrequence;

    @Value("${spring.jpa.properties.hibernate.jdbc.batch_size}")
    private int batchSize;

    public void stream(URL url) {
        logger.info("Streaming from input {} with {} Implementation", url, getClass().getName());
        try (InputStream inputStream = url.openStream();
             MessageConsumer<R> consumer = getMessageConsumer()) {

            long startNano = System.nanoTime();

            streamData(inputStream, consumer);

            long totalTime = System.nanoTime()-startNano;
            logger.info("{} Total processing time is {} ms, {} seconds",
                                        getClass().getSimpleName(),
                                        TimeUnit.NANOSECONDS.toMillis(totalTime),
                                        TimeUnit.NANOSECONDS.toSeconds(totalTime));
        } catch (Exception e) {
            logger.error(String.format("Error processing filename [%s], please check!", url));
            throw new RuntimeException(e);
        }
    }

    public MessageConsumer<R> getMessageConsumer() {
        return new MessagePublishingConsumer<>(getPublisher(),threadPoolSize)
                        .dequeueFrequence(dequeueFrequence)
                        .batchSize(batchSize);
    }

    public Predicate<T> getFilter() {
        return e -> true;
    }
    public int getBatchSize() {
        return batchSize;
    }
    public int getThreadPoolSize() {
        return threadPoolSize;
    }
    public long getDequeueFrequency() {
        return dequeueFrequence;
    }
    abstract public MessagePublisher<R> getPublisher();
    abstract public Function<T, R> getTransformer();
    abstract public Iterator<T> getIterator(InputStream inputStream, MessageConsumer<R> messageConsumer);
    abstract public void streamData(InputStream inputStream, MessageConsumer<R> messageConsumer) throws Exception;
}
