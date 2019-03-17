package com.stream.entitytype.logMessage.streamer;

import com.stream.consumer.MessageConsumer;
import com.stream.stream.springbatch.SpringBatch;
import com.stream.entitytype.logMessage.LogMessage;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.stereotype.Component;
import javax.inject.Inject;
import java.io.InputStream;

/**
 * * Streaming LogMessage Spring batch
 */
@Component
@EnableBatchProcessing
public class LogMessageSpringBatchStreamer extends LogMessageBaseStreamer {

    @Inject
    private JobLauncher jobLauncher;

    @Inject
    private JobBuilderFactory jobBuilderFactory;

    @Inject
    private StepBuilderFactory stepBuilderFactory;

    @Override
    public void streamData(InputStream inputStream, MessageConsumer<LogMessage> messageConsumer) throws Exception {
                SpringBatch.from(jobLauncher, jobBuilderFactory, stepBuilderFactory,
                                 getIterator(inputStream, messageConsumer),
                                 getTransformer())
                            .batchSize(getBatchSize())
                            .filter(getFilter())
                            .publish(messageConsumer);
    }
}