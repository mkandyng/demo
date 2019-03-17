package com.stream.stream.logMessageStreamer;

import com.stream.entitytype.logMessage.LogMessage;
import com.stream.entitytype.logMessage.LogMessageRepository;
import com.stream.stream.AbstractTransactionalTestStreamer;
import org.springframework.data.repository.CrudRepository;

import javax.inject.Inject;

public abstract class AbstractLogMessageTestStreamer extends AbstractTransactionalTestStreamer<LogMessage,LogMessage,String> {

    @Inject
    private LogMessageRepository repositoryService;

    @Override
    public CrudRepository<LogMessage, String> getRepository() {
        return repositoryService;
    }

    @Override
    public String getInputFile() {
        return "logMessage.log";
    }

    @Override
    public long expectedCount(long loadTestCount) {
        // file had 3 unique id
        return loadTestCount * 3;
    }
}
