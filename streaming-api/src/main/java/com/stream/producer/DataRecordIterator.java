package com.stream.producer;

import com.stream.producer.reader.DataRecordReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.util.Optional;
import java.util.concurrent.*;
import java.util.function.Consumer;

/**
 * This is a generic class that adapt Iterator to reading records from a given
 * reader. It uses a Single Writer principle so that we do not have to worry about
 * thread safety when reading from input stream
 *
 * Note, onNext is blocked for messages in the queue if stream is not closed
 *
 * @param <RECORD>
 */

public class DataRecordIterator<RECORD> implements CloseableStreamIterator<RECORD> {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    private static final int MAX_QUEUE_SIZE = 81920;
    private static final int MAX_QUEUE_READ = MAX_QUEUE_SIZE/2;
    private static final int MAX_BATCH_READ = 1024;
    private static final int MAX_LOOP_COUNTER  =10;
    private final DataRecordReader<RECORD> reader;
    private final BlockingQueue<RECORD> recordBuffer;
    private final Consumer<Throwable> onErrorHandler;
    private final ExecutorService excutorService;
    private volatile boolean isClosed;

    public DataRecordIterator(DataRecordReader<RECORD> reader,
                              Consumer<Throwable> onErrorHandler)  {
        this.onErrorHandler = Optional.ofNullable(onErrorHandler)
                                      .orElse((t -> logger.error("Exception found", t)));
        this.reader = reader;
        this.recordBuffer = new ArrayBlockingQueue<>(MAX_QUEUE_SIZE);
        excutorService = Executors.newSingleThreadExecutor();
        excutorService.submit(new EnqueTask());
        this.isClosed = false;
    }

    /**
     *
     * Batching is necessary so that it is more efficent when streaming system trying to
     * pull data out of next
     * @return {true if not closed and elements in queue}
     */
    @Override
    public boolean hasNext() {
        int loopCounter=0;
        try {
            while(!isClosed()) {
                if(isClosed() || recordBuffer.size() >= MAX_BATCH_READ || loopCounter++ >= MAX_LOOP_COUNTER) {
                    if(isClosed() || !recordBuffer.isEmpty()) {
                        break;
                    }
                }
                TimeUnit.MILLISECONDS.sleep(100);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return !recordBuffer.isEmpty();
    }

    /**
     * hasNext will be block until there is data, so poll is safe to do here
     * @return {RECORD, if element in queue, otherwise null}
     */
    @Override
    public RECORD next() {
        hasNext();
        return recordBuffer.poll();
    }

    @Override
    public void close() {
        isClosed = true;
        try {
            if(reader != null) {
                reader.close();
            }
        } catch (IOException e) {
            onErrorHandler.accept(e);
        }
        excutorService.shutdown();
    }

    public boolean isClosed() {
        return isClosed;
    }

    private class EnqueTask implements Runnable {
        @Override
        public void run() {
            try {
                int recordCounter=0;
                while (!isClosed()) {
                    if (recordBuffer.remainingCapacity() > MAX_QUEUE_READ) {
                        RECORD record;
                        while ((record = reader.readRecord()) != null) {
                            recordBuffer.put(record);
                            recordCounter++;
                            if (recordBuffer.size() >= MAX_QUEUE_READ) {
                                break;
                            }
                        }
                        if (record == null) {
                            close();
                            logger.info("Total records queued by data Reader {}, isClosed {}", recordCounter, isClosed());
                        }
                    }

                    TimeUnit.MILLISECONDS.sleep(100);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } catch (Exception ex) {
                onErrorHandler.accept(ex);
            } finally {
                close();
            }
        }
    }
}