package com.mkandyng.instrumentservice.exception;

import org.junit.Before;
import org.junit.Test;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class InvalidRequestControllerTest {
    private InvalidRequestController controller;

    @Before
    public void setup() {
        controller = new InvalidRequestController();
    }

    @Test
    public void shouldReturnErrorRequest() {
        // Given
        String expectedPath = "/error";
        // When
        String actual = controller.getErrorPath();

        // Then
        assertThat(actual).isEqualTo(expectedPath);
    }

    @Test
    public void shouldReturnExceptionWithForwardUriIfNotEmpty() {
        String expectedPath = "/forwardURL";
        testForwardRequestURI(expectedPath, expectedPath);
    }

    @Test
    public void shouldReturnExceptionWithErrorRequestURIEmpty() {
        testForwardRequestURI(controller.getErrorPath(), null);
    }

    private void testForwardRequestURI(String expectedPath, String forwardRequestURI) {
        // Given
        HttpServletRequest request = mock(HttpServletRequest.class);
        given(request.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI)).willReturn(forwardRequestURI);

        // When
        try {
            controller.handleError(request);
        } catch (ResourceNotFoundException e) {
            // Then
            assertThat(e.getMessage()).contains(expectedPath);
        }
    }
}
