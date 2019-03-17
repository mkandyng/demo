package com.stream.entitytype.user;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Typing the CRUD to User for User Repository
 */
@Repository
public interface UserRepository extends CrudRepository<User, Long> {}