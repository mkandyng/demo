package com.stream.entitytype.user.transformer;

import com.stream.entitytype.user.User;
import java.util.function.Function;

/**
 * Convert User read from Web to remove Id as we generate it when persisting it
 */
public class UserWebUserTransformer implements Function<User, User> {
    @Override
    public User apply(User user) {
        user.setId(null);
        return user;
    }
}
