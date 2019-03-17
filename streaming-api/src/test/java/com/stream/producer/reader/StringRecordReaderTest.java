package com.stream.producer.reader;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class StringRecordReaderTest extends AbstractRecordReaderTest<String> {

    private final InputStream inputStream;
    private final String inputString;

    public StringRecordReaderTest() {
        inputString = "text1\ntext2\ntest3";
        inputStream = new ByteArrayInputStream(inputString.getBytes());
    }

    @Override
    int getRecordCount() {
        return (int) inputString.chars()
                                .filter(e->e=='\n')
                                .count() + 1;
    }

    @Override
    DataRecordReader<String> getReader() {
        return new StringRecordReader(inputStream);
    }
}
