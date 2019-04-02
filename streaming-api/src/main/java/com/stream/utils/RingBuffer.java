package com.stream.utils;

import sun.misc.Contended;

import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 *
 * This ring buffer uses two indexes to track reader and writer index position
 * Only the key methods are implemented as it is a good solution queue replacement
 *
 * @param <E>, elementType that the RingBuffer hold
 *
 */

public class RingBuffer<E> implements BlockingQueue<E> {
    private final E[] buffer;
    private final int capacity;
    private AtomicInteger writeIndex;
    @Contended
    private AtomicInteger readIndex;

    public RingBuffer(int capacity) {
        if (capacity < 1) {
            throw new IllegalArgumentException("bufferSize must not be less than 1");
        } else if (Integer.bitCount(capacity) != 1) {
            throw new IllegalArgumentException("bufferSize must be a power of 2");
        }
        this.capacity = capacity+1;
        writeIndex = new AtomicInteger(0);
        readIndex = new AtomicInteger(0);
        buffer = createBuffer();
    }

    @Override
    public int size() {
        if(writeIndex.get() == 0 && readIndex.get() == 0) {
            return 0;
        } else if(writeIndex.get() > readIndex.get()) {
            return writeIndex.get() - readIndex.get();
        } else {
            return (capacity - readIndex.get()) + writeIndex.get();
        }
    }

    @Override
    public boolean isEmpty() {
        return !this.isFull() && (writeIndex.get() == readIndex.get());
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
        while (!offer(element)) {
            TimeUnit.MILLISECONDS.sleep(1);
        }
    }

    @Override
    public E poll() {
        return (isEmpty()) ? null : deQueue();
    }

    @Override
    public E take() throws InterruptedException {
        E element;
        while ((element = poll()) == null) {
            TimeUnit.MILLISECONDS.sleep(1);
        }
        return element;
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
    public int remainingCapacity() {
        return (capacity-1) - size();
    }

    @Override
    public E peek() {
        if(isEmpty()) {
            return null;
        } else {
            return buffer[readIndex.get()];
        }
    }

    @Override
    public void clear() {
        int k = readIndex.get() + writeIndex.get();
        if (k > 0) {
            readIndex.set(0);
            writeIndex.set(0);
        }
    }

    @SuppressWarnings("unchecked")
    private E[] createBuffer() {
        return (E[])new Object[this.capacity];
    }

    private void checkNotNull(E element) {
        if (element == null) {
            throw new NullPointerException();
        }
    }

    private boolean isFull() {
        return readIndex.get() == ((writeIndex.get() + 1) % capacity);
    }

    private E deQueue() {
        E element = buffer[readIndex.getAndSet((readIndex.get() + 1) % capacity)];
        return element;
    }

    private void enqueue(E element) {
        buffer[writeIndex.getAndSet((writeIndex.get()+1) % capacity)] = element;
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