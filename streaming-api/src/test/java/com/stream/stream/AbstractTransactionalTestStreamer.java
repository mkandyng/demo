package com.stream.stream;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.repository.CrudRepository;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringRunner;
import javax.inject.Inject;

@RunWith(SpringRunner.class)
@SpringBootTest
public abstract class AbstractTransactionalTestStreamer<T,R,I> extends AbstractTransactionalJUnit4SpringContextTests {

    @Inject
    @Value("${spring.application.load.test.count}")
    public int loadTestCount;

    @Test
    public void shouldRunLoadTest() throws Exception {
        StreamerTestDelegate<T,R,I> delegate = new StreamerTestDelegate<>(getInputFile(),"testdata");
        delegate.loadTest(getStreamer(), getRepository(), loadTestCount, expectedCount(loadTestCount));
    }

    public abstract ResourceStreamer<T,R> getStreamer();

    public abstract CrudRepository<R, I> getRepository();

    public abstract String getInputFile();

    public abstract long expectedCount(long loadTestCount);
}
