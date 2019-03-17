package com.stream.entitytype.user;

import com.stream.entitytype.user.transformer.UserByteArraysTransformer;
import com.stream.entitytype.user.transformer.UserStringTransformer;
import com.stream.entitytype.user.transformer.UserWebUserTransformer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 * Wring of spring configuration for User transformers
 *
 */
@Configuration
public class UserSpringConfig {
    @Bean
    @Qualifier("userStringTransformer")
    public UserStringTransformer userStringTransformer() {
        return new UserStringTransformer(",");
    }

    @Bean
    @Qualifier("userByteArrayTransformer")
    public UserByteArraysTransformer userByteArrayTransformer() {
        return new UserByteArraysTransformer(',');
    }

    @Bean
    @Qualifier("userWebUserTransformer")
    public UserWebUserTransformer userWebUserTransformer() {
        return new UserWebUserTransformer();
    }


}
