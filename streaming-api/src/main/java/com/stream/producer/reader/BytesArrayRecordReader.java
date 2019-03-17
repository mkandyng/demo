package com.stream.producer.reader;

import java.io.*;

/**
 * This reader is to demonstrate reading of byte [] for each CSV record
 * This is useful in real latency sensitive processing where processing
 * string is not performance
 */
public class BytesArrayRecordReader implements DataRecordReader<byte[]> {

    private static final int MAX_BUFFER_SIZE=81920;
    private final InputStream reader;
    private final byte[] byteChunks = new byte[MAX_BUFFER_SIZE];

    public BytesArrayRecordReader(InputStream inputStream)  {
        this.reader = new BufferedInputStream(inputStream);
    }

    @Override
    public byte[] readRecord() throws IOException {
        final int NEW_LINE_BYTE = (byte) '\n';
        final int CARRIAGE_RETURN = (byte) '\r';
        int counter = 0;
        int byteRead;
        while((byteRead = reader.read()) != -1) {
            if(byteRead == CARRIAGE_RETURN) {
                continue;
            } else if(byteRead == NEW_LINE_BYTE) {
                break;
            } else {
                byteChunks[counter++] = (byte) byteRead;
            }
        }
        if(counter>0) {
            byte[] line = new byte[counter];
            System.arraycopy(byteChunks, 0, line, 0, counter);
            return line;
        }
        return null;
    }

    @Override
    public void close() throws IOException {
        reader.close();
    }

}