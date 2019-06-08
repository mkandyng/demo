package com.mkandyng.instrumentservice.exception;

import com.mkandyng.instrumentservice.quote.QuoteRequestController;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

/**
 *
 * WebMvc Integration tests for {@link QuoteRequestController}
 *
 * The purpose of the controller is an adaptor for the REST API request to call the
 * service layer. It is better to integrate with spring context with CustomExceptionHandler
 * to test the behaviour of the mvc handling of the Instrument Request API
 *
 * To keep the test focus on the behaviour of the controller, we mock out the
 * QuoteRetrieverService as full end-2-end test is done by the regressionTests test
 *
 */

@RunWith(SpringRunner.class)
@WebMvcTest(InvalidRequestController.class)
public class InvalidRequestControllerIntTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void shouldReturnInvalidRestURLOnError() throws Exception {
        // Given
        String expectedErrorMessage = "Invalid Rest URL";

        // When
        MockHttpServletResponse response = mvc.perform(
                get("/error")
                        .header("Origin","*")
                        .accept(MediaType.APPLICATION_JSON))
                .andReturn().getResponse();

        // Then
        assertThat(response.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
        assertThat(response.getContentAsString()).contains(expectedErrorMessage);
    }
}
