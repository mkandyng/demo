package com.stream.entitytype.user;

import com.stream.entitytype.user.transformer.UserWebUserTransformer;
import org.junit.Before;
import org.junit.Test;
import java.io.IOException;
import java.util.function.Function;

import static org.assertj.core.api.Assertions.assertThat;

public class UserWebUserTransformerTest {

    private Function<User, User> transformer;
    
    @Before
    public void setup() {
        transformer = new UserWebUserTransformer();
    }

    @Test
    public void shouldConvertCommaSeparateFieldToUser() {
        // Given
        User user = new User();
        user.setId(1L);
        user.setName("dd");

        User transformedUser = transformer.apply(user);
        assertThat(transformedUser.getName()).isEqualTo(user.getName());
        assertThat(transformedUser.getId()).isNull();
    }
}
