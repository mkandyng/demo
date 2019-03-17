package com.stream.producer.reader;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class JsonRecordReaderTest extends AbstractRecordReaderTest<String> {

    private final InputStream inputStream;
    private final String inputString;

    public JsonRecordReaderTest() {
        inputString = "{'id':'testdata-1'}{'id':'testdata-2'}{'id':'testdata-3'}";
        inputStream = new ByteArrayInputStream(inputString.getBytes());
    }

    @Override
    int getRecordCount() {
        return (int) inputString.chars()
                                .filter(e -> e == '}')
                                .count();
    }

    @Override
    DataRecordReader<String> getReader() {
        return new JsonRecordReader<>(inputStream, TestEntity.class);
    }

    private class TestEntity {
        private String id;

        public void setId(String id) {
            this.id = id;
        }
    }

}
