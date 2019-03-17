package com.stream.entitytype.logMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.function.Predicate;

/**
 *
 * Filter to only forward logMessageStreamer when we have both start/finish events
 * The logic uses the Map to hold previous matched Id value
 *
 */

public class LogMessageFilter implements Predicate<LogMessage> {
    private static final Logger logger = LoggerFactory.getLogger(LogMessageFilter.class);

    private final Map<String, LogMessage> logEventsCache;

    public LogMessageFilter(Map<String, LogMessage> logEventsCache) {
        this.logEventsCache = logEventsCache;
    }

    @Override
    public boolean test(LogMessage logMessage) {
        logger.debug(String.format("Lookup previously stored entry %s", logMessage.getId()));
        LogMessage storedMessageEvent = logEventsCache.putIfAbsent(logMessage.getId(), logMessage);
        return logEntryWasInLookup(logMessage, storedMessageEvent);
    }

    private boolean logEntryWasInLookup(LogMessage logMessageEvent, LogMessage storedMessageEvent) {
        return storedMessageEvent != null && storedMessageEvent != logMessageEvent;
    }
}
