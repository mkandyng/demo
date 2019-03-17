package com.stream.utils;

import org.junit.Before;
import org.junit.Test;
import java.util.concurrent.*;

import static org.assertj.core.api.Assertions.assertThat;

public class SpinLockTest {
    private SpinLock lock;

    @Before
    public void setup() {
        lock = new SpinLock();
    }

    @Test
    public void shouldAcquireLockWhenNotLocked() throws InterruptedException, ExecutionException {
        // Given
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        final Integer intValue = 9;

        // When
        Future<Integer> future = executorService.submit(() -> {
                                    Integer value;
                                    lock.lock();
                                    try {
                                        value = intValue;
                                    } finally {
                                        lock.unlock();
                                    }

                                    return value;
        });

        // Then
        Integer value = future.get();
        assertThat(value).isEqualTo(intValue);
    }

    @Test
    public void shouldLockedWhenCriticalSessionIsLocked() throws InterruptedException {
        // Given
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        final BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(1);
        CountDownLatch countDownLatch = new CountDownLatch(1);

        // When
        Future<Integer> future = executorService.submit(() -> {
                                        Integer value;
                                        lock.lock();
                                        try {
                                            countDownLatch.countDown();
                                            value = queue.take();
                                            System.out.println("dd");
                                        } finally {
                                            lock.unlock();
                                        }
                                        return value;
        });

        countDownLatch.await();
        // Then
        assertThat(lock.isLocked()).isTrue();
    }
}
