package com.mkandyng.instrumentservice.exception;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.function.BiFunction;
import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

/**
 *  Unit tests for {@link CustomExceptionHandler}
 */

public class CustomExceptionHandlerTest {

    private CustomExceptionHandler customExceptionHandler;

    @Before
    public void setup() {
        customExceptionHandler = Mockito.spy(new CustomExceptionHandler());
    }

    @Test
    public void shouldHandleRecordNotFoundException() {
        testHandler(
                mock(ResourceNotFoundException.class),
                HttpStatus.NOT_FOUND,
                (exception,request) -> customExceptionHandler.handleResourceNotFoundException(exception, request)
        );
    }

    @Test
    public void shouldDefaultAllExceptionsAsInternalServerError() {
        testHandler(
                mock(Exception.class),
                HttpStatus.INTERNAL_SERVER_ERROR,
                (exception,request) -> customExceptionHandler.handleAllExceptions(exception, request)
        );
    }

    @Test
    public void shouldHandleMethodArgumentNotValidException() {
        // Given
        String errorMessage = "Exception Thrown";
        List<ObjectError> allErrors = new ArrayList<>();
        allErrors.add(new ObjectError(errorMessage, errorMessage));
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        WebRequest webRequest = mock(WebRequest.class);
        given(exception.getBindingResult()).willReturn(bindingResult);
        given(bindingResult.getAllErrors()).willReturn(allErrors);


        // When
        ResponseEntity<Object> responseEntity = customExceptionHandler.handleMethodArgumentNotValid(
                exception,
                mock(HttpHeaders.class),
                HttpStatus.BAD_REQUEST,
                webRequest);

        ExceptionResponse exceptionResponse = ((ExceptionResponse) responseEntity.getBody());

        // Then
        assertThat(exceptionResponse.getDetails().toString()).contains(errorMessage);
        assertThat(exceptionResponse.getMessage()).contains("Validation Failed");
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    private <T extends Exception> void testHandler(T exception,
                             HttpStatus httpStatus,
                             BiFunction<T,WebRequest,ResponseEntity<Object>> function) {
        // Given
        String errorMessage = "Exception Thrown";
        WebRequest webRequest = mock(WebRequest.class);
        given(exception.getLocalizedMessage()).willReturn(errorMessage);


        // When
        ResponseEntity<Object> responseEntity = function.apply(exception, webRequest);
        String expectedErrorDetails = ((ExceptionResponse) responseEntity.getBody()).getDetails().toString();

        // Then
        assertThat(expectedErrorDetails).contains(errorMessage);
        assertThat(responseEntity.getStatusCode()).isEqualTo(httpStatus);
    }
}
