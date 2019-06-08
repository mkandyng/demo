package com.mkandyng.instrumentservice.exception;

/**
 * Custom Exception when no resource in search result
 */
public class ResourceNotFoundException extends RuntimeException
{
    public ResourceNotFoundException(String exception) {
        super(exception);
    }
}