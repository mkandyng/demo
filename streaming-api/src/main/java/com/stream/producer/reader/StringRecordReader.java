package com.stream.producer.reader;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Reading each line for a given record, use for CSV
 */
public class StringRecordReader implements DataRecordReader<String> {
    private final BufferedReader reader;

    public StringRecordReader(InputStream inputStream)  {
        this.reader = new BufferedReader(new InputStreamReader(inputStream));
    }

    @Override
    public String readRecord() throws IOException {
        return reader.readLine();
    }

    @Override
    public void close() throws IOException {
        reader.close();
    }
}