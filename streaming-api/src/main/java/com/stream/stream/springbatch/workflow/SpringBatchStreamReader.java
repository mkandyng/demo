package com.stream.stream.springbatch.workflow;

import com.stream.producer.CloseableStreamIterator;
import org.springframework.batch.item.ItemReader;
import java.io.Closeable;
import java.io.IOException;

/**
 *
 * Iterator adaptor to the Spring Batch ItemReader, and closeable interface
 *
 * @param <T>
 */

public class SpringBatchStreamReader<T> implements ItemReader<T>, Closeable {

    private final CloseableStreamIterator<T> iterator;

    public SpringBatchStreamReader(CloseableStreamIterator<T> iterator) {
        this.iterator = iterator;
    }

    @Override
    public T read() {
        if (hasNext()) {
            return next();
        }
        return null;
    }

    private boolean hasNext() {
        return iterator.hasNext();
    }

    public T next() {
        return iterator.next();
    }

    @Override
    public void close() throws IOException {
        iterator.close();
    }
}