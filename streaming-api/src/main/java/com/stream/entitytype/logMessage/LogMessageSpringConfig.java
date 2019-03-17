package com.stream.entitytype.logMessage;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 *
 * Wring of spring configuration for LogMessage
 *
 */
@Configuration
public class LogMessageSpringConfig {

    @Bean
    public Map<String, LogMessage> logMessagesCache() {
        final int INITIAL_CACHE_CAPACITY = 1024;
        return new ConcurrentHashMap<>(INITIAL_CACHE_CAPACITY);
    }

    @Bean
    @Qualifier("logMessageFilter")
    public LogMessageFilter logMessageFilter(final Map<String, LogMessage> logMessagesCache) {
        return new LogMessageFilter(logMessagesCache);
    }

    @Bean
    @Qualifier("logMessageTransformer")
    public LogMessageTransformer logMessageTransformer(final Map<String, LogMessage> logMessagesCache) {
        return new LogMessageTransformer(logMessagesCache);
    }
}
