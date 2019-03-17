package com.stream.utils;

import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

/**
 *
 * This ring buffer uses two indexes to track reader and writer index position
 * Only the key methods are implemented as it is a good solution queue replacement
 * as it uses two locks and it is better performance than queue, especially when
 * we have 1 writer and 1 reader message producer and consumer senario, then it is
 * pretty much lock free.
 *
 * SpinLock is use because locking is very rare and is use for visibility as assess for lock
 * should be quick
 *
 * @param <E>, elementType that the RingBuffer hold
 *
 */

public class RingBuffer<E> implements BlockingQueue<E> {
    private final E[] buffer;
    private final int capacity;
    private final SpinLock lock;
    private final Condition notEmpty;
    private final Condition notFull;
    private int writeIndex;
    private int readIndex;

    public RingBuffer(int capacity) {
        if(capacity <= 0) {
            throw new IllegalArgumentException("A positive queue capacity is required");
        }
        this.capacity = capacity+1;
        lock = new SpinLock();
        notEmpty = lock.newCondition();
        notFull =  lock.newCondition();
        writeIndex = 0;
        readIndex = 0;
        buffer = createBuffer();
    }

    @Override
    public int size() {
        if(writeIndex == 0 && readIndex == 0) {
            return 0;
        } else if(writeIndex > readIndex) {
            return writeIndex - readIndex;
        } else {
            return (capacity - readIndex) + writeIndex;
        }
    }

    @Override
    public boolean isEmpty() {
        return !this.isFull() && (writeIndex == readIndex);
    }

    @Override
    public boolean offer(E element) {
        checkNotNull(element);
        if (isFull()) {
            return false;
        } else {
            enqueue(element);
            return true;
        }
    }

    @Override
    public void put(E element) throws InterruptedException {
        checkNotNull(element);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (isFull()) {
                notFull.await();
            }
            offer(element);
        } finally {
            lock.unlock();
        }
    }

    @Override
    public E poll() {
        return (isEmpty()) ? null : deQueue();
    }

    @Override
    public E take() throws InterruptedException {
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (isEmpty())
                notEmpty.await();
            return deQueue();
        } finally {
            lock.unlock();
        }
    }

    @Override
    public int remainingCapacity() {
        return (capacity-1) - size();
    }

    @Override
    public E peek() {
        if(isEmpty()) {
            return null;
        } else {
            return buffer[readIndex];
        }
    }

    @Override
    public void clear() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            int k = readIndex + writeIndex;
            if (k > 0) {
                readIndex = 0;
                writeIndex = 0;
                if(lock.hasWaiters(notFull)) {
                    notFull.signalAll();
                }
            }
        } finally {
            lock.unlock();
        }
    }

    @SuppressWarnings("unchecked")
    private E[] createBuffer() {
        return (E[])new Object[this.capacity];
    }

    private void checkNotNull(E element) {
        if (element == null) throw new NullPointerException();
    }

    private boolean isFull() {
        return readIndex == ((writeIndex + 1) % capacity);
    }

    private E deQueue() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            E element = buffer[readIndex];
            readIndex = (readIndex + 1) % capacity;
            if(lock.hasWaiters(notFull)) {
                notFull.signalAll();
            }
            return element;
        } finally {
            lock.unlock();
        }
    }

    private void enqueue(E element) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            buffer[writeIndex] = element;
            writeIndex = (writeIndex+1) % capacity;
            if(lock.hasWaiters(notEmpty)) {
                notEmpty.signalAll();
            }
        } finally {
            lock.unlock();
        }
    }

    @Override
    public int drainTo(Collection<? super E> c) {
        return drainTo(c, size());
    }

    @Override
    public int drainTo(Collection<? super E> c, int maxElements) {
        E element;
        int counter=0;
        while((element = poll()) !=null) {
            c.add(element);
            if(counter++>=maxElements-1) {
                break;
            }
        }
        return counter;
    }

    @Override
    public boolean add(E element) {
        if(!offer(element)) {
            throw new IllegalStateException("Queue is currently full");
        }
        return true;
    }

    @Override
    public boolean addAll(Collection<? extends E> elements) {
        elements.forEach(this::add);
        return true;
    }

    @Override
    public E element() {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @Override
    public E remove() {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @Override
    public boolean offer(E element, long timeout, TimeUnit unit) {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @Override
    public E poll(long timeout, TimeUnit unit) {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @Override
    public boolean remove(Object o) {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @Override
    public boolean retainAll(Collection c) {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @Override
    public boolean removeAll(Collection c) {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @Override
    public boolean containsAll(Collection c) {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @Override
    public boolean contains(Object o) {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @Override
    public Iterator<E> iterator() {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @Override
    public E[] toArray() {
        throw new UnsupportedOperationException("Unsupported operation");
    }

    @SuppressWarnings("unchecked")
    @Override
    public E[] toArray(Object[] a) {
        throw new UnsupportedOperationException("Unsupported operation");
    }
}