package com.stream.producer.reader;

import java.io.IOException;

/**
 * Define the Reader to read each data type per record
 * @param <T>
 */
public interface DataRecordReader<T> {
    void close() throws IOException;
    T readRecord() throws IOException;
}
