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


    @Before
    public void setup() throws IOException {
        given(reader.readRecord()).willReturn(null);
        dataRecordIterator = new DataRecordIterator<>(reader, onErrorHandler);
    }

    @Test
    public void shouldReturnTrueOnHasNextWhenThereAreRecord() throws IOException {
        // Given
        given(reader.readRecord()).willReturn("data");

        Runnable runnable = () -> {
            // When
            boolean hasNext = dataRecordIterator.hasNext();

            // Then
            assertThat(hasNext).isTrue();
        };

        dataRecordIterator = new VerifyBeforeClosedDataRecordIterator(reader, onErrorHandler, runnable);
    }

    @Test
    public void shouldReturnObjectOnNextWhenThereAreRecord() throws IOException {
        // Given
        given(reader.readRecord()).willReturn("data");
        dataRecordIterator = new VerifyBeforeClosedDataRecordIterator(
                reader,
                onErrorHandler,
                () -> {
                    // When
                    String item = dataRecordIterator.next();

                    // Then
                    assertThat(item).isNotNull();
                });
    }

    @Test
    public void shouldReturnNullOnNextWhenEmpty() throws InterruptedException {
        // Given
        waitUntilIteratorIsClosed(dataRecordIterator);

        // When
        String item = dataRecordIterator.next();

        // Then
        assertThat(item).isNull();
    }

    @Test
    public void shouldReturnFalseOnHasNextWhenEmptyAndClosed() throws InterruptedException {
        // Given
        waitUntilIteratorIsClosed(dataRecordIterator);

        // When
        boolean hasNext = dataRecordIterator.hasNext();

        // Then
        assertThat(hasNext).isFalse();
    }

    @Test(expected = TimeoutException.class)
    public void shouldBlockOnHasNextWhenEmptyAndNotClosed() throws IOException, InterruptedException, ExecutionException, TimeoutException {

        // Given
        given(reader.readRecord()).willReturn(null);
        dataRecordIterator = new VerifyBeforeClosedDataRecordIterator(
                reader,
                onErrorHandler,
                () -> {
                    try {
                        TimeUnit.MINUTES.sleep(1);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                });

        // When
        Executors.newSingleThreadExecutor().submit(() -> dataRecordIterator.hasNext()).get(100, TimeUnit.MILLISECONDS);

        // Then
    }

    @Test
    public void shouldCallErrorHandlerOnReadException() throws IOException {
        // Given
        Exception exception = new RuntimeException();
        given(reader.readRecord()).willThrow(exception);
        dataRecordIterator = new VerifyBeforeClosedDataRecordIterator(
                reader,
                onErrorHandler,
                () -> verify(onErrorHandler).accept(exception));
    }

    @Test
    public void shouldCallClosedWhenReadReturnNull() throws IOException, InterruptedException {
        // Given

        // When
        waitUntilIteratorIsClosed(dataRecordIterator);

        // Then
        verify(reader,atLeastOnce()).close();
    }


    private void waitUntilIteratorIsClosed(DataRecordIterator<String> iterator) throws InterruptedException {
        int count=0;
        while(!iterator.isClosed() || count++ >=100) {
            TimeUnit.MILLISECONDS.sleep(100);
        }
    }

    private class VerifyBeforeClosedDataRecordIterator extends DataRecordIterator<String> {
        private final Runnable runnable;
        public VerifyBeforeClosedDataRecordIterator(DataRecordReader<String> reader,
                                                    Consumer<Throwable> onErrorHandler,
                                                    Runnable runnable) {
            super(reader, onErrorHandler);
            this.runnable = runnable;
        }

        @Override
        public void close() {
                runnable.run();
                super.close();
        }
    }

}
