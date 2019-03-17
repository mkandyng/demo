package com.stream.producer.reader;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;

/**
 *
 * Read basic JSON format to entity type
 * Note, this is not a generic class as it cannot process all type of JSON
 * to all type of entity, more work needs for that.
 *
 * @param <T>
 */
public class JsonRecordReader<T>  implements DataRecordReader<T>  {
    private final Gson gson;
    private final Type objectType;
    private final JsonReader reader;

    public JsonRecordReader(InputStream inputStream, Type objectType)  {
        this.gson = new GsonBuilder().create();
        this.objectType = objectType;
        this.reader = new JsonReader(new BufferedReader(new InputStreamReader(inputStream)));
        this.reader.setLenient(true);
    }

    @Override
    public T readRecord() throws IOException {
        T record = null;
        while(reader.peek() != JsonToken.END_DOCUMENT) {
            if(reader.peek() == JsonToken.BEGIN_ARRAY) {
                record = processJsonArray();
                break;
            } else if(reader.peek() == JsonToken.END_ARRAY) {
                reader.endArray();
            } else if(reader.peek() == JsonToken.BEGIN_OBJECT) {
                record = processJsonObject();
                break;
            } else {
                // ignore non json
                reader.skipValue();
            }
        }
        return record;
    }

    @Override
    public void close() throws IOException {
        reader.close();
    }

    private T processJsonArray() throws IOException {
        reader.beginArray();
        return processJsonObject();
    }

    private T processJsonObject() {
        return gson.fromJson(reader, objectType);
    }

}
