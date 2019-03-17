package com.stream;

import com.stream.entitytype.user.streamer.UserByteArrayJavastreamStreamer;
import com.stream.entitytype.user.streamer.UserStringRxJavaStreamer;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.logMessage.streamer.LogMessageAkkaStreamer;
import com.stream.entitytype.logMessage.streamer.LogMessageJavastreamStreamer;
import com.stream.entitytype.logMessage.streamer.LogMessageLmaxDistruptorStreamer;
import com.stream.entitytype.logMessage.streamer.LogMessageRxJavaStreamer;
import com.stream.entitytype.logMessage.streamer.LogMessageSpringBatchStreamer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 *
 * Wiring a list of valid streamers to be used by the Application
 *
 */

@Configuration
public class ApplicationSpringConfig {
    @Bean
    @Qualifier("fileStreamers")
    public List<ResourceStreamer> fileStreamers(
            @Qualifier("logMessageStreamers") List<ResourceStreamer> logMessageStreamers,
            @Qualifier("userStreamers") List<ResourceStreamer> userStreamers) {
        List<ResourceStreamer> list = new ArrayList<>();
        list.addAll(logMessageStreamers);
        list.addAll(userStreamers);
        return list;
    }

    @Bean
    @Qualifier("logMessageStreamers")
    public List<ResourceStreamer> logMessageStreamers (
                                LogMessageJavastreamStreamer logMessageJavastreamStreamer,
                                LogMessageAkkaStreamer logMessageAkkaStreamer,
                                LogMessageRxJavaStreamer logMessageRxJavaStreamer,
                                LogMessageLmaxDistruptorStreamer logMessageLmaxDistruptorStreamer,
                                LogMessageSpringBatchStreamer logMessageSpringBatchStreamer) {

        return new ArrayList<>(Arrays.asList(logMessageJavastreamStreamer,
                                             logMessageAkkaStreamer,
                                             logMessageRxJavaStreamer,
                                             logMessageLmaxDistruptorStreamer,
                                             logMessageSpringBatchStreamer));
    }

    @Bean
    @Qualifier("userStreamers")
    public List<ResourceStreamer> userStreamers (
                    UserByteArrayJavastreamStreamer userByteArrayJavastreamStreamer,
                    UserStringRxJavaStreamer userStringRxJavaStreamer) {

        return new ArrayList<>(
                Arrays.asList(userByteArrayJavastreamStreamer, userStringRxJavaStreamer)
        );
    }
}
