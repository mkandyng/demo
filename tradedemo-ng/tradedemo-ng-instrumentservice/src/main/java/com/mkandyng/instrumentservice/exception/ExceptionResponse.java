package com.mkandyng.instrumentservice.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Custom Exception Response POJO used to convert to JSON representation
 */
public class ExceptionResponse
{
    private final HttpStatus httpStatus;
    private final String message;
    private final LocalDateTime timestamp;
    private final List<String> details;

    public ExceptionResponse(
            HttpStatus httpStatus,
            String message,
            List<String> details) {
        this.httpStatus = httpStatus;
        this.message = message;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    public String getHttpStatus() {
        return httpStatus.name() + "[" + httpStatus.value() + "]";
    }

    public String getTimestamp() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss");
        return formatter.format(timestamp);
    }

    public String getMessage() {
        return message;
    }

    public List<String> getDetails() {
        return details;
    }
}