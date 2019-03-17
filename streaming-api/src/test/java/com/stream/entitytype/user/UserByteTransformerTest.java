package com.stream.entitytype.user;

import com.stream.entitytype.user.transformer.UserByteArraysTransformer;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

public class UserByteTransformerTest {

    private Function<byte[], User> transformer;

    @Before
    public void setup() {
        transformer = new UserByteArraysTransformer(',');
    }

    @Test
    public void shouldConvertCommaSeparateFieldToUser() throws IOException {
        // Given

        List<User> listUsers =  Files.lines(Paths.get(new ClassPathResource("user.csv")
                                                 .getFile()
                                                 .getPath()))
                                     .map(String::getBytes)
                                     .map(transformer)
                                     .collect(Collectors.toList());

        assertThat(listUsers.isEmpty()).isFalse();
    }
}
