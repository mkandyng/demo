package com.stream.utils;

import org.junit.Before;
import org.junit.Test;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import static org.assertj.core.api.Assertions.assertThat;

public class RingBufferTest {

    private BlockingQueue<Integer> queue;
    private int queueCapacity;

    @Before
    public void init() {
        queueCapacity = 100;
        queue = new RingBuffer<>(queueCapacity);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldThrowExceptionWithCapacityOfZero() {
        queue = new RingBuffer<>(0);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldThrowExceptionWithCapacityOfLessZero() {
        queue = new RingBuffer<>((new Random()).nextInt(Integer.MAX_VALUE) * -1);
    }

    @Test
    public void shouldBeEmptyWhenYouAddMaxCapacityAndThenConsumeIt() {
        // Given
        List<Integer> intList = populateList(queueCapacity);
        queue.drainTo(intList);

        // When
        boolean empty = queue.isEmpty();

        assertThat(empty).isTrue();
    }

    @Test
    public void shouldDrainTheCompleteQueueToEmpty() {
        // Given
        List<Integer> intList = populateList(queueCapacity);

        // When
        queue.drainTo(intList);

        assertThat(queue.isEmpty()).isTrue();
    }

    @Test
    public void shouldDrainFixedSize() {
        // Given
        List<Integer> intList = populateList(queueCapacity);

        // When
        queue.drainTo(intList, intList.size()/2);

        assertThat(queue.size()).isEqualTo(queueCapacity/2);
    }

    @Test
    public void shouldReturnCorrectSizeWhenOfferElementsToQueue() {
        // Given
        List<Integer> intList = populateList(3);

        // When
        int size = queue.size();

        assertThat(size).isEqualTo(intList.size());
    }

    @Test
    public void shouldReturnElementsInFIFOAndDrainedQueue() {
        // Given
        List<Integer> intList = populateList(queueCapacity);
        List<Integer> queueList = new ArrayList<>();

        // When
        queue.drainTo(queueList);

        // Then
        assertThat(intList).isEqualTo(queueList);
        assertThat(queue).isEmpty();
    }

    @Test
    public void shouldEmptyListWhenClear() {
        // Given
        populateList(queueCapacity);

        // When
        queue.clear();

        // Then
        assertThat(queue).isEmpty();
    }

    @Test
    public void shouldReturnCorrectCapacity() {
        // Given
        int numOfElements = queueCapacity-2;
        populateList(numOfElements);
        int expectedCorrectCapacity = queueCapacity-numOfElements;
        queue.offer(1);
        queue.poll();

        // When
        int remainingCapacity = queue.remainingCapacity();

        // Then
        assertThat(remainingCapacity).isEqualTo(expectedCorrectCapacity);
    }

    @Test
    public void shouldReturnTrueWhenOfferWithCapacity() {
        // Given
        populateList(queueCapacity-1);

        // When
        boolean offered = queue.offer(1);

        // Then
        assertThat(offered).isTrue();
    }

    @Test
    public void shouldReturnFalseWhenOfferOnFull() {
        // Given
        populateList(queueCapacity);

        // When
        boolean offered = queue.offer(1);

        // Then
        assertThat(offered).isFalse();
    }

    @Test
    public void shouldReturnValueWhenPollWithQueueItems() {
        // Given
        Integer item = 8;
        queue.offer(item);

        // When
        Integer value = queue.poll();

        // Then
        assertThat(value).isEqualTo(item);
        assertThat(queue.isEmpty()).isTrue();
    }

    @Test
    public void shouldReturnNullWhenPollOnQueueIsEmpty() {
        // Given

        // When
        Integer value = queue.poll();

        // Then
        assertThat(value).isNull();
    }

    @Test
    public void shouldReturnValueWhenTakeWithQueueItems() throws InterruptedException {
        // Given
        Integer item = 8;
        queue.offer(item);

        // When
        Integer value = queue.take();

        // Then
        assertThat(value).isEqualTo(item);
        assertThat(queue.isEmpty()).isTrue();
    }

    @Test(expected = TimeoutException.class)
    public void shouldBlockWhenTakeOnQueueIsEmpty() throws InterruptedException, ExecutionException, TimeoutException {
        // Given
        ExecutorService executorService = Executors.newSingleThreadExecutor();

        // When
        Future<Integer> future = executorService.submit(() -> queue.take());

        // Then
        future.get(100, TimeUnit.MILLISECONDS);
    }

    @Test
    public void shouldAddItemToQueueWhenPutIsNotFull() throws InterruptedException {
        // Given
        Integer item = 8;

        // When
        queue.put(item);

        // Then
        assertThat(queue.isEmpty()).isFalse();
    }

    @Test(expected = TimeoutException.class)
    public void shouldBlockWhenPutOnQueueIsFull() throws InterruptedException, ExecutionException, TimeoutException {
        // Given
        populateList(queueCapacity);
        ExecutorService executorService = Executors.newSingleThreadExecutor();

        // When
        Future<Integer> future = executorService.submit(() -> {
            queue.put(1);
            return queue.poll();
        });

        // Then
        future.get(100, TimeUnit.MILLISECONDS);
    }


    @Test
    public void shouldPeekWithoutDeque() {
        // Given
        Integer expectedValue = 9;

        queue.offer(expectedValue);
        // When
        Integer value = queue.peek();

        // Then
        assertThat(value).isEqualTo(expectedValue);
        assertThat(queue.size()).isEqualTo(1);
    }

    @Test
    public void shouldAddElementReturningTrueWhenNotFull() {
        // Given
        Integer expectedValue = 9;

        // When
        boolean success = queue.add(expectedValue);

        // Then
        assertThat(success).isTrue();
    }

    @Test(expected = IllegalStateException.class)
    public void shouldThrowIllegalStateExceptionWhenAddingToFullQueue() {
        // Given
        populateList(queueCapacity);

        // When
        boolean offered = queue.add(1);

        // Then
    }

    @Test
    public void shouldAddAllElementsWhenQueueHasCapacity() {
        // Given
        List<Integer> list = IntStream.range(0, 10).boxed().collect(Collectors.toList());

        // When
        boolean success = queue.addAll(list);

        // Then
        assertThat(success).isEqualTo(true);
        assertThat(queue.size()).isEqualTo(list.size());
    }

    @Test
    public void shouldThrowExceptionWhenCapacityIsReached() {
        // Given
        List<Integer> list = IntStream.range(0, queueCapacity+1).boxed().collect(Collectors.toList());

        // When
        try {
            queue.addAll(list);
        } catch (IllegalStateException e) {
            // Then
            assertThat(queue.size()).isEqualTo(list.size()-1);
        }
    }


    private List<Integer> populateList(int count) {
        List<Integer> intList = IntStream.range(0,count).boxed().collect(Collectors.toList());
        intList.forEach(queue::offer);
        return intList;
    }

}
