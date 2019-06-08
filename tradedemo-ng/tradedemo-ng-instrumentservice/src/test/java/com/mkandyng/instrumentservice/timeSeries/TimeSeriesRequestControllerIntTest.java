package com.mkandyng.instrumentservice.timeSeries;

import com.mkandyng.instrumentservice.timeSeries.dailyPrice.DailyPriceTimeSeriesRetrieverService;
import com.mkandyng.instrumentservice.timeSeries.intradayPrice.IntradayPriceTimeSeriesRetrieverService;
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
import java.util.function.Function;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

/**
 *
 * WebMvc Integration tests for {@link TimeSeriesRequestController}
 *
 * The purpose of the controller is an adaptor for the REST API request to call the
 * service layer. It is better to integrate with spring context with CustomExceptionHandler
 * to test the behaviour of the mvc handling of the Instrument Request API
 *
 * To keep the test focus on the behaviour of the controller, we mock out the
 * IntradayPriceTimeSeriesRetrieverService and  DailyPriceTimeSeriesRetrieverService
 * as full end-2-end test is done by the regressionTests test
 *
 */

@RunWith(SpringRunner.class)
@WebMvcTest(TimeSeriesRequestController.class)
public class TimeSeriesRequestControllerIntTest {

    @Autowired
    private MockMvc mvc;

    @MockBean(name = "intradayPriceTimeSeriesRetrieverService")
    private IntradayPriceTimeSeriesRetrieverService intradayPriceTimeSeriesRetrieverService;

    @MockBean(name = "dailyPriceTimeSeriesRetrieverService")
    private DailyPriceTimeSeriesRetrieverService dailyPriceTimeSeriesRetrieverService;

    private String symbol;

    private JacksonTester<List<TimeSeries>> jsonTimeSeries;

    @Before
    public void setup() {
        symbol = "symbol";
        JacksonTester.initFields(this, new ObjectMapper());
    }

    @Test
    public void shouldReturnNotFoundWhenIntradayTimeSeriesAreEmpty() throws Exception {
        testTimeSeriesWhenEmpty("/intradayPrices/" + symbol, intradayPriceTimeSeriesRetrieverService::getTimeSeries);
    }

    @Test
    public void shouldRetrievedIntradayTimeSeriesWhenNotEmpty() throws Exception {
        testTimeSeriesWhenNotEmpty("/intradayPrices/" + symbol, intradayPriceTimeSeriesRetrieverService::getTimeSeries);
    }

    @Test
    public void shouldReturnNotFoundWhenDailyTimeSeriesAreEmpty() throws Exception {
        testTimeSeriesWhenEmpty("/dailyPrices/" + symbol, dailyPriceTimeSeriesRetrieverService::getTimeSeries);
    }

    @Test
    public void shouldRetrievedDailyTimeSeriesWhenNotEmpty() throws Exception {
        testTimeSeriesWhenNotEmpty("/dailyPrices/" + symbol, dailyPriceTimeSeriesRetrieverService::getTimeSeries);
    }

    private void testTimeSeriesWhenEmpty(String url, Function<String, List<TimeSeries>> timeSeriesRetriever) throws Exception {
        // Given
        given(timeSeriesRetriever.apply(symbol)).willReturn(Collections.emptyList());

        // When
        MockHttpServletResponse response = mvc.perform(
                get(url).header("Origin", "*")
                        .accept(MediaType.APPLICATION_JSON))
                .andReturn()
                .getResponse();

        // Then
        assertThat(response.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
        assertThat(response.getContentAsString()).contains("No TimeSeries found for symbol");
    }


    private void testTimeSeriesWhenNotEmpty(String url, Function<String, List<TimeSeries>> timeSeriesRetriever) throws Exception {
        // Given
        List<TimeSeries> timeSeries = new ArrayList<>();
        timeSeries.add(new TimeSeries("2019-11-11", 1.0, 1.0, 1.0, 1.0, 1L));
        given(timeSeriesRetriever.apply(symbol)).willReturn(timeSeries);

        // When
        MockHttpServletResponse response = mvc.perform(
                get(url).header("Origin", "*")
                        .accept(MediaType.APPLICATION_JSON))
                .andReturn()
                .getResponse();

        // Then
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).isEqualTo(
                jsonTimeSeries.write(timeSeries).getJson()
        );
    }

}
