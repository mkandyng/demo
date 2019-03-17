package com.stream.utils;

import java.util.concurrent.locks.ReentrantLock;

/**
 *
 * Implemented this to take advantage of the fact that implementation of RingBuffer
 * means locking is rare and quick, and lock is use for publishing data for visibility
 *
 * A safetynet is added to breakout if exceed a threshold
 *
 * https://unix.stackexchange.com/questions/5088/what-is-a-spinlock-in-linux/5104#5104
 *
 */
public class SpinLock extends ReentrantLock {
    public SpinLock() {
        super();
    }

    public void lock() {
        final int MAX_SPINLOCK_LOOP=100000;
        int counter=0;
        boolean exceedTimeout=false;
        while(!super.tryLock()) {
            if(counter++>MAX_SPINLOCK_LOOP) {
                exceedTimeout=true;
                break;
            }
        }
        if(exceedTimeout) {
            super.lock();
        }
    }

    @SuppressWarnings("EmptyMethod")
    public void unlock() {
        super.unlock();
    }

}
