package com.stream.stream.userStreamer;

import com.stream.entitytype.user.User;
import com.stream.entitytype.user.UserRepository;
import com.stream.stream.AbstractTransactionalTestStreamer;
import org.springframework.data.repository.CrudRepository;
import javax.inject.Inject;

public abstract class AbstractUserTestStreamer<T> extends AbstractTransactionalTestStreamer<T, User, Long> {

    @Inject
    private UserRepository repositoryService;

    @Override
    public CrudRepository<User, Long> getRepository() {
        return repositoryService;
    }

    @Override
    public long expectedCount(long loadTestCount) {
        // file had 4 line
        return loadTestCount * 4;
    }

    @Override
    public String getInputFile() {
        return "user.csv";
    }
}
