package com.stream.entitytype.user.transformer;

import com.stream.entitytype.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.function.Function;

/**
 * Convert comma separate CSV to user object
 */
public class UserStringTransformer implements Function<String, User> {
    private static final Logger logger = LoggerFactory.getLogger(UserStringTransformer.class);

    private final static int USER_FIELDS_MIN_LENGTH=5;
    private final String delimiter;

    public UserStringTransformer(String delimiter) {
        this.delimiter = delimiter;
    }
    
    @Override
    public User apply(String line) {
        User user = null;
        String [] fields = line.split(delimiter);
        if(fields.length >= USER_FIELDS_MIN_LENGTH ) {
            user = new User();
            user.setName(fields[0]);
            user.setUsername(fields[1]);
            user.setEmail(fields[2]);
            user.setPhone(fields[3]);
            user.setWebsite(fields[4]);
        } else {
            logger.error(String.format("Invalid line %s", line));
        }
        return user;
    }
}
