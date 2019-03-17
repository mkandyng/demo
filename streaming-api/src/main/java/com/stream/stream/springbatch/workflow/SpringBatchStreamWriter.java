package com.stream.stream.springbatch.workflow;

import com.stream.consumer.MessageConsumer;
import org.springframework.batch.item.ItemWriter;
import java.util.List;

/**
 *
 * A Stream consumer adaptor to the Spring Batch ItemWriter Interface
 *
 * @param <R>
 */

public class SpringBatchStreamWriter<R> implements ItemWriter<R> {

    private final MessageConsumer<R> messageConsumer;

    public SpringBatchStreamWriter(MessageConsumer<R> messageConsumer) {
        this.messageConsumer = messageConsumer;
    }

    @Override
    public void write(List<? extends R> entities) {
        entities.forEach(messageConsumer::onNext);
    }

}