package com.stream.stream.userStreamer;

import com.stream.entitytype.user.User;
import com.stream.stream.ResourceStreamer;
import com.stream.entitytype.user.streamer.UserStringRxJavaStreamer;
import javax.inject.Inject;


public class UserStringRxJavaUserTest extends AbstractUserTestStreamer {
    @Inject
    private UserStringRxJavaStreamer streamer;

    @Override
    public ResourceStreamer<String, User> getStreamer() {
        return streamer;
    }
}
