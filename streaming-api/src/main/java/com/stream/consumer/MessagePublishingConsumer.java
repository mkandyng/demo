package com.stream.consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.LongAdder;

/**
 *
 * MessagePublishingConsumer is a generic consumer of message events
 *
 * It is non blocking until up to MAX_QUEUE_SIZE to prevent Out Of Memory
 * Dedicated thread to dequeue and batch messages to submit task to thread pool
 *
 * This MessagePublisherConsumer is inspired by the Distruptor design which uses the
 * Single Writer principle and with the usage of RingBuffer and SpinLock to achieve Mechanical Sympathy.
 *
 * In fact in this design the reader contention also eliminate reader contention (single reader) so worker
 * threads are truly parallel and only worker thread that persist to DB will be blocked by IO during persistent.
 *
 * https://mechanical-sympathy.blogspot.com/2011/09/single-writer-principle.html
 *
 */

public class MessagePublishingConsumer<T> implements MessageConsumer<T> {
    private static final Logger logger = LoggerFactory.getLogger(MessagePublishingConsumer.class);
    private static final int DEFAULT_QUEUE_SIZE = 10240;
    private final ExecutorService deQueueExecutorService;
    private final DequeTask deQueueTask;
    private final BlockingQueue<T> queue;
    private final int threadPoolSize;
    private MessagePublisher<T> messagePublisher;
    private int batchSize = 100;
    private long dequeueFrequence = TimeUnit.MILLISECONDS.toMillis(1000);
    private LongAdder counter;
    private volatile boolean isRunning;

    public MessagePublishingConsumer(MessagePublisher<T> messagePublisher, int threadPoolSize) {
        this(messagePublisher, threadPoolSize, DEFAULT_QUEUE_SIZE);
    }

    public MessagePublishingConsumer(MessagePublisher<T> messagePublisher,
                                     int threadPoolSize,
                                     int queueSize) {
        if((queueSize % 1024) != 0) {
            throw new IllegalArgumentException("Queue size needs to be multiple of 1024 (1K) to be effective");
        }
        this.messagePublisher = messagePublisher;
        this.queue = new ArrayBlockingQueue<>(queueSize);
        this.threadPoolSize = threadPoolSize;
        this.counter = new LongAdder();

        deQueueTask = new DequeTask();
        deQueueExecutorService = Executors.newSingleThreadExecutor();
        isRunning=true;
        deQueueExecutorService.submit(deQueueTask);
    }

    public synchronized MessagePublishingConsumer<T> batchSize(int batchSize) {
        this.batchSize = batchSize;
        return this;
    }

    public synchronized MessagePublishingConsumer<T> dequeueFrequence(long dequeueFrequence) {
        this.dequeueFrequence = dequeueFrequence;
        return this;
    }

    @Override
    public void onNext(T event) {
        try {
            queue.put(event);
            counter.increment();
            logger.debug("Adding event {} to queue to process, total {}", event, counter.longValue());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Override
    public void onError(Throwable t) {
        throw new RuntimeException("Error when processing stream, aborting", t);
    }

    @Override
    public void close() {
        if (deQueueTask.terminate(deQueueExecutorService)) {
            logger.info("Successfully shutdown message consumer");
        } else {
            logger.error("Failed shutdown message consumer");
            deQueueExecutorService.shutdownNow();
            throw new RuntimeException("Failed to shutdown message consumer, aborting");
        }
    }

    private class DequeTask implements Runnable {
        private final ExecutorService executorService;
        DequeTask() {
            executorService = Executors.newFixedThreadPool(threadPoolSize);
        }

        @Override
        public void run() {
            logger.info("Started DequeTaskThread, with [{}] ms delay favouring writer", dequeueFrequence);
            while (isRunning) {
                try {
                    TimeUnit.MILLISECONDS.sleep(dequeueFrequence);
                    submitBatchesToThreadPool();
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                }
            }
            submitFinalBatches();
            executorService.shutdown();
        }

        boolean terminate(ExecutorService deQueueService) {
            try {
                if(!isRunning) {
                    return true;
                }
                logger.info("Shutting down thread pool");
                while(!queue.isEmpty()) {
                    // Only shutdown after we have drained the queue
                    TimeUnit.MILLISECONDS.sleep(dequeueFrequence);
                }
                isRunning=false;
                logger.info("Queue is drained, ready to initiate shutdown, total received {}", counter);
                // Give it a long time before aborting wait to allow it to finish all the job
                executorService.awaitTermination(1, TimeUnit.MINUTES);
                deQueueService.shutdown();
                deQueueService.awaitTermination(1,TimeUnit.MINUTES);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return executorService.isTerminated() &&
                    deQueueService.isTerminated() &&
                    queue.isEmpty();
        }

        private void submitFinalBatches() {
            while(!queue.isEmpty()) {
                submitBatchesToThreadPool();
            }
        }

        private void submitBatchesToThreadPool() {
            int threadCount=0;
            while(!queue.isEmpty()) {
                batchAndSubmit(batchSize);
                if(threadCount++>=threadPoolSize) {
                    break;
                }
            }
        }

        private void batchAndSubmit(int targetBatchSize) {
            if (!queue.isEmpty()) {
                int readBatchSize = queue.size() > targetBatchSize?targetBatchSize:queue.size();
                final List<T> events = new ArrayList<>(targetBatchSize);
                int readCount = queue.drainTo(events, readBatchSize);
                if (readCount > 0) {
                    logger.debug("Persisting {} events", events);
                    executorService.execute(() -> messagePublisher.publish(events));
                }
            }
        }
    }
}
