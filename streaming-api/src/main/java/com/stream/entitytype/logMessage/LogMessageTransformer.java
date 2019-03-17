package com.stream.entitytype.logMessage;

import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

/**
 *
 * Enriched the message with start/end time, duration, and alert
 * Also remove logMessageStreamer from cache to reduce memory footprint
 *
 */
public class LogMessageTransformer implements Function<LogMessage, LogMessage> {

    private final Map<String, LogMessage> logEventsCache;
    private long alertThreshold = TimeUnit.MILLISECONDS.toMillis(10);
    private String jsonStreamerType = "";

    public LogMessageTransformer(Map<String, LogMessage> logEventsCache) {
        this.logEventsCache = logEventsCache;
    }

    public LogMessageTransformer alertThreshold(long alertThreshold) {
        this.alertThreshold = alertThreshold;
        return this;
    }

    public LogMessageTransformer jsonStreamerType(String jsonStreamerType) {
        this.jsonStreamerType = jsonStreamerType;
        return this;
    }
    
    @Override
    public LogMessage apply(LogMessage logMessage) {
        LogMessage storedMessageEvent = logEventsCache.get(logMessage.getId());
        if(storedMessageEvent == null) {
            throw new IllegalStateException(String.format("Processing pipeline required %s before %s",
                                            LogMessageFilter.class.getName(), this.getClass().getName()));
        }

        setStartEndTime(logMessage, storedMessageEvent);
        LogMessage message = logEventsCache.remove(storedMessageEvent.getId());
        message.setId(jsonStreamerType.concat(storedMessageEvent.getId()));
        return message;
    }

    private void setStartEndTime(LogMessage logMessageEvent, LogMessage storedMessageEvent) {
        if(logMessageEvent.getTimestamp() > storedMessageEvent.getTimestamp()) {
            storedMessageEvent.setStartTime(storedMessageEvent.getTimestamp());
            storedMessageEvent.setEndTime(logMessageEvent.getTimestamp());
        } else {
            storedMessageEvent.setStartTime(logMessageEvent.getTimestamp());
            storedMessageEvent.setEndTime(storedMessageEvent.getTimestamp());
        }
        storedMessageEvent.setDuration(storedMessageEvent.getEndTime() - storedMessageEvent.getStartTime());
        if(storedMessageEvent.getDuration() > alertThreshold) {
            storedMessageEvent.setAlert(true);
        }
    }
}
