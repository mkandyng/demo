package com.stream.stream.springbatch.workflow;

import org.springframework.batch.item.ItemProcessor;

import java.util.function.Function;
import java.util.function.Predicate;

/**
 *
 * This is an adapter to the message processing pipeline of a typical stream
 * where you want to add filter and then mapping of data
 *
 * @param <In>
 * @param <Out>
 *
 */

public class SpringBatchStreamProcessor<In, Out> implements ItemProcessor<In, Out> {
    private final Predicate<In> filter;
    private final Function<In,Out> transformer;

    public SpringBatchStreamProcessor(Predicate<In> filter, Function<In, Out> transformer) {
        this.filter = filter;
        this.transformer = transformer;
    }

    @Override
    public Out process(In inputMessage) {
        if(filter.test(inputMessage)) {
            return transformer.apply(inputMessage);
        }
        return null;
    }
}