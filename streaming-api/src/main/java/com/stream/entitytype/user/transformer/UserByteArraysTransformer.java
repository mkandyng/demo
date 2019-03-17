package com.stream.entitytype.user.transformer;

import com.stream.entitytype.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Arrays;
import java.util.function.Consumer;
import java.util.function.Function;

/**
 * Transforming byte array with comma separate CSV format to User object
 * Usually, processing large data with String is creating too many objects
 * So processing byte is better for low latency performance
 */
public class UserByteArraysTransformer implements Function<byte[], User> {
    private static final Logger logger = LoggerFactory.getLogger(UserByteArraysTransformer.class);
    private final byte delimiter;

    public UserByteArraysTransformer(char delimiter) {
        this.delimiter = (byte) delimiter;
    }

    public User apply(byte[] bytes) {
        User user = new User();
        try {
            int nextStartPosition = 0;
            nextStartPosition = setValue(bytes, nextStartPosition, user::setName);
            nextStartPosition = setValue(bytes, nextStartPosition, user::setUsername);
            nextStartPosition = setValue(bytes, nextStartPosition, user::setEmail);
            nextStartPosition = setValue(bytes, nextStartPosition, user::setPhone);
            setValue(bytes, nextStartPosition, user::setWebsite);
        } catch (Exception e) {
            logger.error(String.format("Invalid line %s", new String(bytes)), e);
        }
        return user;
    }

    private int setValue(byte[] bytes,  int startPosition, Consumer<String> setter) {
        int delimiterPosition = findFieldLength(bytes, startPosition);
        String value = new String(Arrays.copyOfRange(bytes, startPosition, delimiterPosition));
        setter.accept(value);
        return delimiterPosition+1;
    }

    private int findFieldLength(byte[] fieldBuffer, int startIndex) {
        int i;
        for(i=startIndex; i <fieldBuffer.length; i++) {
            if(fieldBuffer[i] == delimiter) {
                break;
            }
        }
        return i;
    }
}
