package com.stream.stream.javastream.Spliterator;

import java.util.Iterator;
import java.util.function.Consumer;

/**
 * Define the specifc InputStream splitter
 *
 * @param <T>
 */
public class InputStreamSpliterator<T> extends AbstractBatchSpliterator<T> {
    private final Iterator<T> iterator;

    public InputStreamSpliterator(Iterator<T> iterator, int batchSize) {
        super(IMMUTABLE | ORDERED | NONNULL, batchSize);
        this.iterator = iterator;
    }

    @Override
    public boolean tryAdvance(Consumer<? super T> action) {
        if(iterator.hasNext()) {
            action.accept(iterator.next());
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void forEachRemaining(Consumer<? super T> action) {
        try {
            while(iterator.hasNext()) {
                action.accept(iterator.next());
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
