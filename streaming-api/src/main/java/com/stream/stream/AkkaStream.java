package com.stream.stream;

import akka.Done;
import akka.actor.ActorSystem;
import akka.stream.ActorMaterializer;
import akka.stream.OverflowStrategy;
import akka.stream.javadsl.*;
import com.stream.consumer.MessageConsumer;
import com.stream.producer.CloseableStreamIterator;
import java.util.concurrent.CompletionStage;
import java.util.function.Function;

/**
 * A generic entity agnostic AkkaStream which provide a mechanism to create
 * a AkkaStream streamer against a particular entity type in a simple to use API
 *
 * @param <T>, input data type
 * @param <R>, target data type, which is going to be an entity for persistent
 */
public final class AkkaStream<T,R> extends BaseReactiveStream<T,R> {

    protected AkkaStream(CloseableStreamIterator<T> iterator, Function<T, R> transformer) {
        super(iterator, transformer);
    }

    public static<T,R> AkkaStream<T,R> from(CloseableStreamIterator<T> iterator, Function<T,R> transformer) {
        return new AkkaStream<>(iterator, transformer);
    }

    @Override
    public void publish(MessageConsumer<R> messageConsumer) {
        ActorSystem system = ActorSystem.create("akkaMessageStreamer");
        try {
            final RunnableGraph<CompletionStage<Done>> runnable =
                    Source.from(() -> iterator)
                            .async()
                            .buffer(batchSize, OverflowStrategy.backpressure())
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
