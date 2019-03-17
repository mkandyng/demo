package com.stream.entitytype.logMessage;

import org.junit.Before;
import org.junit.Test;


import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class LogMessageTransformerTest {

    private LogMessageTransformer transformer;
    private Map<String, LogMessage> logEventsCache;


    @Before
    public void setup() {
        logEventsCache = new HashMap<>();
        transformer = new LogMessageTransformer(logEventsCache);
        transformer.alertThreshold(3);
    }

    @Test
    public void shouldEnrichedTimingForFirstMessageWithOlderTimestamp() {
        verify(System.currentTimeMillis(),System.currentTimeMillis()+10,3, true);
    }

    @Test
    public void shouldEnrichedTimingForSecondMessageWithOlderTimestamp() {
        verify(System.currentTimeMillis()+10,System.currentTimeMillis(),3, true);
    }

    @Test
    public void shouldEnrichedAlertToFalseWhenDurationLessThanAlertThreshold() {
        verify(System.currentTimeMillis()+10,System.currentTimeMillis(),15, false);
    }

    private void verify(long timestamp1, long timestamp2, long alertThreshold, boolean alert) {
        // Given
        LogMessage message1 = new LogMessage();
        message1.setId("batchId-1");
        message1.setTimestamp(timestamp1);
        logEventsCache.put(message1.getId(), message1);

        LogMessage message2 = new LogMessage();
        message2.setId("batchId-1");
        message2.setTimestamp(timestamp2);

        // When
        transformer.alertThreshold(alertThreshold);
        LogMessage enrichedMessage = transformer.apply(message2);

        // Then
        assertThat(enrichedMessage).isSameAs(message1);
        assertThat(enrichedMessage.getDuration()).isEqualTo(enrichedMessage.getEndTime() - enrichedMessage.getStartTime());
        assertThat(enrichedMessage.isAlert()).isEqualTo(alert);
    }

}
