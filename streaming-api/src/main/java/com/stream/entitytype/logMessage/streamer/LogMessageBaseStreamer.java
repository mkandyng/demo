package com.stream.entitytype.logMessage.streamer;

import com.stream.consumer.EntityRepositoryPublisher;
import com.stream.consumer.MessageConsumer;
import com.stream.producer.CloseableStreamIterator;
import com.stream.producer.DataRecordIterator;
import com.stream.producer.reader.JsonRecordReader;
import com.stream.consumer.MessagePublisher;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.logMessage.LogMessage;
import com.stream.entitytype.logMessage.LogMessageTransformer;
import com.stream.entitytype.logMessage.LogMessageRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import javax.inject.Inject;
import java.io.InputStream;
import java.util.function.Function;
import java.util.function.Predicate;

/**
 * Base class for LogMessage streamer, adapting the different entity to
 * the generic ResourceStreamer
 */
public abstract class LogMessageBaseStreamer extends ResourceStreamer<LogMessage, LogMessage> {

    @Inject
    LogMessageRepository logMessageRepository;

    @Inject
    @Qualifier("logMessageFilter")
    Predicate<LogMessage> logMessageFilter;

    @Inject
    @Qualifier("logMessageTransformer")
    LogMessageTransformer logMessageTransformer;

    @Value("${spring.application.alertInMs}")
    int alertInMs;

    @Override
    public Predicate<LogMessage> getFilter() {
        return logMessageFilter;
    }

    @Override
    public Function<LogMessage, LogMessage> getTransformer() {
        return logMessageTransformer.alertThreshold(alertInMs)
                                 .jsonStreamerType(getClass().getSimpleName());
    }

    @Override
    public MessagePublisher<LogMessage> getPublisher() {
        return new EntityRepositoryPublisher<>(logMessageRepository);
    }

    @Override
    public CloseableStreamIterator<LogMessage> getIterator(InputStream inputStream,
                                                           MessageConsumer<LogMessage> messageConsumer) {
        return new DataRecordIterator<>(new JsonRecordReader<>(inputStream,
                                                                LogMessage.class),
                                                                messageConsumer::onError);
    }
}
