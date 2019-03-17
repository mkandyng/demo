package com.stream.stream.userStreamer;

import com.stream.entitytype.user.User;
import com.stream.entitytype.user.streamer.UserByteArrayJavastreamStreamer;
import com.stream.stream.ResourceStreamer;
import javax.inject.Inject;

public class UserByteArrayJavastreamTest extends AbstractUserTestStreamer {
    @Inject
    private UserByteArrayJavastreamStreamer streamer;

    @Override
    public ResourceStreamer<byte[], User> getStreamer() {
        return streamer;
    }
}
