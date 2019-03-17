package com.stream.entitytype.logMessage;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class LogMessageFilterTest {

    private LogMessageFilter filter;
    private Map<String, LogMessage> logEventsCache;


    @Before
    public void setup() {
        logEventsCache = new HashMap<>();
        filter = new LogMessageFilter(logEventsCache);
    }


    @Test
    public void shouldFilterOutFirstRecordIdAddToCache() {
        // Given
        LogMessage message = new LogMessage();
        message.setId("SomeId");
        message.setState("SomeState");

        // When
        boolean isAccepted = filter.test(message);

        // Then
        assertThat(isAccepted).isFalse();
        assertThat(logEventsCache.isEmpty()).isFalse();
    }

    @Test
    public void shouldProcessSecondMatchedRecordId() {
        // Given
        LogMessage message = new LogMessage();
        message.setId("SomeId");
        message.setState("SomeState");

        LogMessage message2 = new LogMessage();
        message2.setId("SomeId");
        message2.setState("SomeState2");

        // When
        filter.test(message);
        boolean secondRecord = filter.test(message2);

        // Then
        assertThat(secondRecord).isTrue();
    }
}
