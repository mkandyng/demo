package com.mkandyng.instrumentservice.quote;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
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
@WebMvcTest(QuoteRequestController.class)
public class QuoteRequestControllerIntTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private QuoteRetrieverService quoteRetrieverService;

    private String symbol;

    private JacksonTester<Quote> jsonQuote;


    @Before
    public void setup() {
        symbol = "symbol";
        JacksonTester.initFields(this, new ObjectMapper());
    }

    @Test
    public void shouldReturnNoQuoteIfQuoteIsNull() throws Exception {
        // Given
        given(quoteRetrieverService.getQuote(symbol)).willReturn(null);

        // When
        MockHttpServletResponse response = mvc.perform(
                get("/instrumentQuote/" + symbol)
                        .header("Origin","*")
                        .accept(MediaType.APPLICATION_JSON))
                .andReturn().getResponse();

        // Then
        assertThat(response.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
        assertThat(response.getContentAsString()).contains("No quote found for given symbol");
    }

    @Test
    public void shouldRetrievedInstrumentQuote() throws Exception {
        // Given
        Quote expectedQuote = new Quote(1.0, 1.0, 1.0, 1.0, 1L, 1.0);
        given(quoteRetrieverService.getQuote(symbol)).willReturn(expectedQuote);

        // When
        MockHttpServletResponse response = mvc.perform(
                get("/instrumentQuote/" + symbol)
                        .header("Origin","*")
                        .accept(MediaType.APPLICATION_JSON))
                .andReturn().getResponse();

        // Then
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).isEqualTo(
                jsonQuote.write(expectedQuote).getJson()
        );
    }

}
