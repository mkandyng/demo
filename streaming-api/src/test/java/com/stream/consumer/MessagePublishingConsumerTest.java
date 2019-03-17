package com.stream.consumer;

import ch.qos.logback.classic.Level;
import com.stream.utils.FakePublisher;
import com.stream.utils.TestHelperUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

/**
 *
 * MessagePublishingConsumerTest, test the exposed MessageConsumer interface
 * leveraging StubPublisher and TestHelperUtils to verify correct behaviour,
 * keeping the test simple and ignore the real complexity of the Publisher
 *
 */
public class MessagePublishingConsumerTest {
    private MessageConsumer<String> consumer;

    private FakePublisher stubPublisher;
    private TestHelperUtils testHelperUtils;

    @Before
    @SuppressWarnings("unchecked")
    public void setup() {
        stubPublisher = new FakePublisher();
        testHelperUtils = new TestHelperUtils();
        consumer = spy(new MessagePublishingConsumer<>(stubPublisher, 1));
    }

    @After
    public void tierDown() {
        consumer.close();
    }

    @Test
    public void shouldPublishedForEachElementsOnNext() {
        // Given
        int messageCount = (new Random()).nextInt(1000);
        List<String> messages = new ArrayList<>(messageCount);
        for(int i=0; i<messageCount; i++) {
            messages.add("msg" + i);
        }

        // When
        messages.forEach(consumer::onNext);

        // Then
        consumer.close();
        assertThat(stubPublisher.getTotal()).isEqualTo(messages.size());
    }

    @Test
    public void shouldCloseAndThrowExceptionOnError() {
        // Given

        // When
        try {
            consumer.onError(new RuntimeException("Failed to process"));
            fail("Should have throw exception");
        } catch (RuntimeException ex) {
            verify(consumer).close();
        }
    }

    @Test
    public void shouldLoggedShutdownWhenClose() {
        // Given

        // When
        consumer.close();

        // then
        testHelperUtils.verifyLoggedMessage(Level.INFO, "Successfully shutdown");
    }

}
