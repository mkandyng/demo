package com.stream.producer.reader;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class ByteArrayRecordReaderTest extends AbstractRecordReaderTest<byte[]> {

    private final InputStream inputStream;
    private final String inputString;

    public ByteArrayRecordReaderTest() {
        inputString = "text1\r\ntext2\r\ntest3";
        inputStream = new ByteArrayInputStream(inputString.getBytes());
    }

    @Override
    int getRecordCount() {
        return (int) inputString.chars()
                                .filter(e->e=='\n')
                                .count() + 1;
    }

    @Override
    DataRecordReader<byte[]> getReader() {
        return new BytesArrayRecordReader(inputStream);
    }
}
