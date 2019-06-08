package com.mkandyng.instrumentservice;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.fail;

public class TestHelperUtils {
    private final MockAppender mockAppender;

    public TestHelperUtils() {
        Logger root = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        mockAppender = new MockAppender();
        mockAppender.start();
        root.addAppender(mockAppender);
    }

    public void verifyLoggedMessage(Level level, String message) {
        boolean matched = mockAppender.containEvent(level, message);
        if(!matched) {
            fail(String.format("Expected Log Level [%s] and Message [%s] not found in log!", level, message));
        }
    }

    public class MockAppender extends AppenderBase<ILoggingEvent> {
        private final List<ILoggingEvent> events = new ArrayList<>();

        @Override
        protected void append(ILoggingEvent event) {
            events.add(event);
        }

        public boolean containEvent(final Level level, final String message) {
            return events.stream()
                    .filter(e -> e.getLevel().equals(level))
                    .anyMatch(e -> e.getFormattedMessage().contains(message));
        }
    }
}
