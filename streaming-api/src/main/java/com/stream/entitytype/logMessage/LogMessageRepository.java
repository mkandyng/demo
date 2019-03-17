package com.stream.entitytype.logMessage;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * Extend basic JPA CrudRepository and let spring boot
 * wire up the Repository with Crud on logMessageStreamer
 *
 */

@Repository
public interface LogMessageRepository extends CrudRepository<LogMessage, String> {
}
