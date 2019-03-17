package com.stream.stream;

import akka.Done;
import akka.actor.ActorSystem;
import akka.stream.ActorMaterializer;
import akka.stream.OverflowStrategy;
import akka.stream.javadsl.*;
import com.stream.consumer.MessageConsumer;
import java.util.Iterator;
import java.util.Optional;
import java.util.concurrent.CompletionStage;
import java.util.function.Function;
import java.util.function.Predicate;

/**
 * A generic entity agnostic AkkaStream which provide a mechanism to create
 * a AkkaStream streamer against a particular entity type in a simple to use API
 *
 * @param <T>, input data type
 * @param <R>, target data type, which is going to be an entity for persistent
 */
public final class AkkaStream<T,R> {

    private final Iterator<T> iterator;
    private final Function<T,R> transformer;
    private Predicate<T> filter;
    private int buffer;

    private AkkaStream(Iterator<T> iterator,
                       Function<T,R> transformer) {
        this.iterator = iterator;
        this.transformer = transformer;
        this.filter = e->true;
        this.buffer = 1;
    }

    public static<T,R> AkkaStream<T,R> from(Iterator<T> iterator, Function<T,R> transformer) {
        return new AkkaStream<>(iterator, transformer);
    }

    public AkkaStream<T,R> filter(Predicate<T> filter) {
        this.filter = filter;
        return this;
    }

    public AkkaStream<T,R> buffer(int buffer) {
        this.buffer = buffer;
        return this;
    }

    public void publish(MessageConsumer<R> messageConsumer) {
        ActorSystem system = ActorSystem.create("akkaMessageStreamer");
        try {
            final RunnableGraph<CompletionStage<Done>> runnable =
                    Source.from(() -> iterator)
                            .async()
                            .buffer(buffer, OverflowStrategy.backpressure())
                            .filter(filter::test)
                            .map(transformer::apply)
                            .toMat(Sink.foreach(messageConsumer::onNext), Keep.right());
            final CompletionStage<Done> done = runnable.run(ActorMaterializer.create(system));
            done.toCompletableFuture().get();
        } catch (Throwable e) {
            messageConsumer.onError(e);
        } finally {
            system.terminate();
        }
    }
}
