package com.stream.producer;

import java.io.Closeable;
import java.util.Iterator;

/**
 * Interface for the iterator so that we different streaming framework can leverage
 * on iterating elements and close input stream when done
 *
 * @param <T>
 */
public interface CloseableStreamIterator<T> extends Iterator<T>, Closeable {}
