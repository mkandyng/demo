package com.mkandyng.instrumentservice.dataprovider;

import com.mkandyng.instrumentservice.MarketDataProviderConfig;
import org.junit.Before;
import org.junit.Test;
import static org.assertj.core.api.Assertions.assertThat;

/**
 *
 * Unit tests for {@link AlphaVantageRestAPI}.
 * Test to confirm generated URL contain AlphaVantage URL prefix, symbol and apikey
 *
 */

public class AlphaVantageRestAPITest {

    /*private MarketDataProviderRestAPI instrumentDataProviderRestAPI;
    private String apiKey;

    @Before
    public void setup() {
        apiKey = "SomeAPIKey";
        MarketDataProviderConfig config = new MarketDataProviderConfig();
        instrumentDataProviderRestAPI = config.marketDataProviderRestAPI(apiKey);
    }

    @Test
    public void shouldGetInstrumentSearchUrl() {
        // Given
        String symbol = "symbol";

        // When
        String url = instrumentDataProviderRestAPI.getInstrumentsSearchUrl(symbol);

        // Then
        assertUrl(symbol, url);
    }

    @Test
    public void shouldGetDailyTimeseriesUrl() {
        // Given
        String symbol = "symbol";

        // When
        String url = instrumentDataProviderRestAPI.getDailyTimeseriesUrl(symbol);

        // Then
        assertUrl(symbol, url);
    }

    @Test
    public void shouldGetIntradayTimeseriesUrl() {
        // Given
        String symbol = "symbol";

        // When
        String url = instrumentDataProviderRestAPI.getIntradayTimeseriesUrl(symbol);

        // Then
        assertUrl(symbol, url);
    }

    @Test
    public void shouldGetIntrumentQuoteUrl() {
        // Given
        String symbol = "symbol";

        // When
        String url = instrumentDataProviderRestAPI.getInstrumentQuotesUrl(symbol);

        // Then
        assertUrl(symbol, url);
    }

    private void assertUrl(String symbol, String url) {
        assertThat(url).startsWith(AlphaVantageRestAPI.API_PREFIX);
        assertThat(url).contains(symbol);
        assertThat(url).endsWith(apiKey);
    }*/
}
