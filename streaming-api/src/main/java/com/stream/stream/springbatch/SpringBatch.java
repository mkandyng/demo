package com.stream.stream.springbatch;

import com.stream.consumer.MessageConsumer;
import com.stream.producer.CloseableStreamIterator;
import com.stream.stream.springbatch.workflow.SpringBatchStreamProcessor;
import com.stream.stream.springbatch.workflow.SpringBatchStreamReader;
import com.stream.stream.springbatch.workflow.SpringBatchStreamWriter;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.JobLauncher;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Predicate;

/**
 * A generic entity agnostic SpringBatch which provide a mechanism to create
 * a SpringBatch streamer against a particular entity type in a simple to use API
 *
 * @param <T>, input data type
 * @param <R>, target data type, which is going to be an entity for persistent
 */

public class SpringBatch<T,R> {

    private final JobLauncher jobLauncher;
    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final CloseableStreamIterator<T> iterator;
    private final Function<T,R> transformer;
    private Predicate<T> filter;
    private int batchSize;

    private SpringBatch(JobLauncher jobLauncher,
                        JobBuilderFactory jobBuilderFactory,
                        StepBuilderFactory stepBuilderFactory,
                        CloseableStreamIterator<T> iterator,
                        Function<T,R> transformer) {
        this.jobLauncher = jobLauncher;
        this.jobBuilderFactory = jobBuilderFactory;
        this.stepBuilderFactory = stepBuilderFactory;
        this.iterator = iterator;
        this.transformer =  transformer;
        this.filter = e->true;
        this.batchSize = 1;
    }

    public static<T,R> SpringBatch<T,R> from(JobLauncher jobLauncher,
                                             JobBuilderFactory jobBuilderFactory,
                                             StepBuilderFactory stepBuilderFactory,
                                             CloseableStreamIterator<T> iterator,
                                             Function<T,R> transformer) {
        return new SpringBatch<>(jobLauncher, jobBuilderFactory, stepBuilderFactory, iterator,transformer);
    }

    public SpringBatch<T,R> filter(Predicate<T> filter) {
        this.filter = filter;
        return this;
    }

    public SpringBatch<T,R> batchSize(int batchSize) {
        this.batchSize = batchSize;
        return this;
    }

    private Job springBatchJob(MessageConsumer<R> messageConsumer) {

        Step step = stepBuilderFactory.get("Spring-batch-streaming")
                .<T, R> chunk(batchSize)
                .reader(new SpringBatchStreamReader<>(iterator))
                .processor(new SpringBatchStreamProcessor<>(filter, transformer))
                .writer(new SpringBatchStreamWriter<>(messageConsumer))
                .build();

        return jobBuilderFactory.get("springBatchJob")
                .start(step)
                .build();
    }

    public void publish(MessageConsumer<R> messageConsumer) throws Exception {
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("source", "Spring Boot" + UUID.randomUUID().toString())
                .toJobParameters();
        jobLauncher.run(springBatchJob(messageConsumer), jobParameters);
    }
}