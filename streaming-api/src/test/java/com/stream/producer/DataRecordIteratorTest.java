package com.stream.producer;

import com.stream.producer.reader.DataRecordReader;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import java.io.IOException;
import java.util.concurrent.*;
import java.util.function.Consumer;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;

/**
 *
 * DataRecordIteratorTest is tricky to test as there are dependency on the enQueue thread
 * that read data to be used for hasNext, next, and close.
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class DataRecordIteratorTest {
    private DataRecordIterator<String> dataRecordIterator;

    @Mock
    private DataRecordReader<String> reader;

    @Mock
    private Consumer<Throwable> onErrorHandler;

    private CountDownLatch beforeCloseLatch;
    private CountDownLatch afterCloseLatch;


    @Before
    public void setup() throws IOException {
        given(reader.readRecord()).willReturn(null);
        beforeCloseLatch = new CountDownLatch(1);
        afterCloseLatch = new CountDownLatch(1);
    }

    @Test
    public void shouldReturnTrueOnHasNextWhenThereAreRecord() throws IOException, InterruptedException {
        // Given
        given(reader.readRecord()).willReturn("data");
        dataRecordIterator = new VerifyBeforeAfterClosedDataRecordIterator(reader, onErrorHandler);
        // When
        boolean hasNext = dataRecordIterator.hasNext();

        // Then
        assertThat(hasNext).isTrue();
    }

    @Test
    public void shouldReturnObjectOnNextWhenThereAreRecord() throws IOException, InterruptedException {
        // Given
        given(reader.readRecord()).willReturn("data");
        dataRecordIterator = new VerifyBeforeAfterClosedDataRecordIterator(reader, onErrorHandler);
        // When
        String item = dataRecordIterator.next();

        // Then
        assertThat(item).isNotNull();
    }

    @Test
    public void shouldReturnNullOnNextWhenEmpty() throws InterruptedException, IOException {
        // Given
        given(reader.readRecord()).willReturn(null);
        dataRecordIterator = new VerifyBeforeAfterClosedDataRecordIterator(reader, onErrorHandler);

        // When
        beforeCloseLatch.countDown();
        String item = dataRecordIterator.next();
        afterCloseLatch.await();

        // Then
        assertThat(item).isNull();
    }

    @Test
    public void shouldReturnFalseOnHasNextWhenEmptyAndClosed() throws InterruptedException, IOException {
        // Given
        given(reader.readRecord()).willReturn(null);
        dataRecordIterator = new VerifyBeforeAfterClosedDataRecordIterator(reader, onErrorHandler);

        beforeCloseLatch.countDown();
        afterCloseLatch.await();

        // When
        boolean hasNext = dataRecordIterator.hasNext();

        // Then
        assertThat(hasNext).isFalse();
    }

    @Test(expected = TimeoutException.class)
    public void shouldBlockOnHasNextWhenEmptyAndNotClosed() throws IOException, InterruptedException, ExecutionException, TimeoutException {

        // Given
        given(reader.readRecord()).willReturn(null);
        dataRecordIterator = new VerifyBeforeAfterClosedDataRecordIterator(reader, onErrorHandler);
        // When
        Executors.newSingleThreadExecutor().submit(() -> dataRecordIterator.hasNext()).get(100, TimeUnit.MILLISECONDS);

        // Then
    }

    @Test
    public void shouldCallErrorHandlerOnReadException() throws IOException, InterruptedException {
        // Given
        Exception exception = new RuntimeException();
        given(reader.readRecord()).willThrow(exception);
        dataRecordIterator = new VerifyBeforeAfterClosedDataRecordIterator(reader, onErrorHandler);
        beforeCloseLatch.countDown();
        afterCloseLatch.await();
        verify(onErrorHandler).accept(exception);
    }

    @Test
    public void shouldCallClosedWhenReadReturnNull() throws IOException, InterruptedException {
        // Given
        given(reader.readRecord()).willReturn(null);

        // When
        dataRecordIterator = new VerifyBeforeAfterClosedDataRecordIterator(reader, onErrorHandler);
        beforeCloseLatch.countDown();
        afterCloseLatch.await();
        // Then
        verify(reader,atLeastOnce()).close();
    }

    private class VerifyBeforeAfterClosedDataRecordIterator extends DataRecordIterator<String> {
        public VerifyBeforeAfterClosedDataRecordIterator(DataRecordReader<String> reader,
                                                         Consumer<Throwable> onErrorHandler) {
            super(reader, onErrorHandler);
        }

        @Override
        public void close() {
            try {
                beforeCloseLatch.await();
                super.close();
                afterCloseLatch.countDown();

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

}
