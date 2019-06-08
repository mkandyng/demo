package com.mkandyng.instrumentservice.instrument;

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
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

/**
 *
 * WebMvc Integration tests for {@link InstrumentRequestController}
 *
 * The purpose of the controller is an adaptor for the REST API request to call the
 * service layer. It is better to integrate with spring context with CustomExceptionHandler
 * to test the behaviour of the mvc handling of the Instrument Request API
 *
 * To keep the test focus on the behaviour of the controller, we mock out the
 * InstrumentRetrieverService as full end-2-end test is done by the regressionTests test
 *
 */

@RunWith(SpringRunner.class)
@WebMvcTest(InstrumentRequestController.class)
public class InstrumentRequestControllerIntTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private InstrumentRetrieverService instrumentRetrieverService;

    private String symbol;

    private JacksonTester<Instrument> jsonInstrument;
    private JacksonTester<Set<Instrument>> jsonInstruments;

    @Before
    public void setup() {
        symbol = "symbol";
        JacksonTester.initFields(this, new ObjectMapper());
    }

    @Test
    public void shouldRetrievedInstrumentsWhenNotEmpty() throws Exception {
        // Given
        Set<Instrument> instruments = new HashSet<>();
        instruments.add(new Instrument("symbol1", "Name", "USD"));
        given(instrumentRetrieverService.getInstruments()).willReturn(instruments);

        // When
        MockHttpServletResponse response = callRestAPI("/instruments");

        // Then
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).isEqualTo(
                jsonInstruments.write(instruments).getJson()
        );
    }

    @Test
    public void shouldReturnNotFoundWhenInstrumentsAreEmpty() throws Exception {
        // Given
        given(instrumentRetrieverService.getInstruments()).willReturn(Collections.emptySet());

        // When
        MockHttpServletResponse response = callRestAPI("/instruments");

        // Then
        assertThat(response.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
        assertThat(response.getContentAsString()).contains("Currently no instrument available for trading");
    }

    @Test
    public void shouldRetrievedInstrumentWhenSymbolMatched() throws Exception {
        // Given
        Set<Instrument> instruments = new HashSet<>();
        Instrument instrument = new Instrument(symbol, "Name", "USD");
        instruments.add(instrument);
        given(instrumentRetrieverService.getInstruments()).willReturn(instruments);

        // When
        MockHttpServletResponse response = callRestAPI("/instruments/" + symbol);

        // Then
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).isEqualTo(
                jsonInstrument.write(instrument).getJson()
        );
    }

    @Test
    public void shouldReturnNotFoundWhenInstrumentWithSymbolNotMatched() throws Exception {
        // Given
        Set<Instrument> instruments = new HashSet<>();
        Instrument instrument = new Instrument(symbol, "Name", "USD");
        instruments.add(instrument);
        given(instrumentRetrieverService.getInstruments()).willReturn(instruments);

        // When
        MockHttpServletResponse response = callRestAPI("/instruments/" + "invalidSymbol");

        // Then throw exception
        assertThat(response.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
        assertThat(response.getContentAsString()).contains("Instrument not found for symbol");
    }

    private MockHttpServletResponse callRestAPI(String restAPI) throws Exception {
        return mvc.perform(
                get(restAPI)
                        .header("Origin", "*")
                        .accept(MediaType.APPLICATION_JSON))
                .andReturn().getResponse();
    }
}
