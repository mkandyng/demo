package com.stream.producer.reader;

import org.junit.Before;
import org.junit.Test;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Setup a templating to test all readers
 *
 * @param <T>
 */

public abstract class AbstractRecordReaderTest<T> {
    private DataRecordReader<T> reader;

    @Before
    public void setup() {
        reader = getReader();
    }

    @Test
    public void shouldReadAllRecords() throws IOException {
        List<T> records = new ArrayList<>();
        T record;
        while((record = reader.readRecord()) != null) {
            records.add(record);
        }
        assertThat(records.size()).isEqualTo(getRecordCount());
        //assertThat(reader.isClosed()).isTrue();
    }

    abstract int getRecordCount();
    abstract DataRecordReader<T> getReader();
}
