package com.mkandyng.instrumentservice.instrument;

import com.mkandyng.instrumentservice.TestHelperUtils;
import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import ch.qos.logback.classic.Level;
import org.springframework.boot.logging.LogLevel;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

/**
 *
 * Unit tests for {@link InstrumentRetrieverService}
 *
 */

@RunWith(MockitoJUnitRunner.class)
public class InstrumentRetrieverServiceTest {
    @Mock
    private RestTemplate restTemplate;
    @Mock
    private MarketDataProviderRestAPI marketDataProviderRestAPI;
    @Mock
    private InstrumentRequestResult instrumentSearchResult;

    private String[] instrumentPrefixList;

    private TestHelperUtils testHelperUtils;

    @Before
    public void setup() {
        testHelperUtils = new TestHelperUtils();
        instrumentPrefixList = new String[]{"AA", "BB"};
        Arrays.stream(instrumentPrefixList)
                .forEach(symbol -> {
                    String url = "url" + "?symbol=" + symbol;
                    given(marketDataProviderRestAPI.getInstrumentsSearchUrl(symbol))
                                                   .willReturn(url);
                    given(restTemplate.getForObject(url, InstrumentRequestResult.class))
                            .willReturn(instrumentSearchResult);
                });
    }

    @Test
    public void shouldRetrieveInstrumentsWhenNotEmpty() {
        testInstrumentService(Arrays.asList(new Instrument[]{new Instrument("symbol", "name", "ccy")}));
    }

    @Test
    public void shouldRetrieveInstrumentsWhenEmpty() {
        testInstrumentService(Collections.emptyList());
    }

    @Test
    public void shouldRetrieveInstrumentsIsNull() {
        testInstrumentService(null);
    }

    @Test
    public void shouldLogErrorWhenExceptionThrownInRestCall() {
        // Given
        restTemplate = mock(RestTemplate.class);
        marketDataProviderRestAPI = mock(MarketDataProviderRestAPI.class);

        Arrays.stream(instrumentPrefixList)
                .forEach(symbol -> {
                    String url = "url" + "?symbol=" + symbol;
                    given(marketDataProviderRestAPI.getInstrumentsSearchUrl(symbol))
                            .willReturn(url);
                    given(restTemplate.getForObject(url, InstrumentRequestResult.class))
                            .willThrow(new RuntimeException("Exception"));
                });

        InstrumentRetrieverService service = new InstrumentRetrieverService(
                restTemplate,
                marketDataProviderRestAPI,
                instrumentPrefixList);

        // When
        Set<Instrument> instruments  = service.getInstruments();


        // Then
        testHelperUtils.verifyLoggedMessage(Level.ERROR, "Exception on instruments search");
        assertThat(instruments).isEmpty();

    }

    private void testInstrumentService(List<Instrument> list) {
        // Given
        List<Instrument> expectedList = Collections.emptyList();
        if(list != null) {
            expectedList = list;
        }
        given(instrumentSearchResult.getInstruments()).willReturn(list);
        InstrumentRetrieverService service = new InstrumentRetrieverService(
                restTemplate,
                marketDataProviderRestAPI,
                instrumentPrefixList);

        // When
        Set<Instrument> instruments  = service.getInstruments();

        // Then
        assertThat(instruments.toArray()).isEqualTo(expectedList.toArray());
    }
}
