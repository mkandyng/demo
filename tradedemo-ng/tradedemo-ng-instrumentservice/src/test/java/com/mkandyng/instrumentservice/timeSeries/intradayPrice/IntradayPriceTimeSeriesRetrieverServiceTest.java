package com.mkandyng.instrumentservice.timeSeries.intradayPrice;

import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;
import com.mkandyng.instrumentservice.timeSeries.BasePriceTimeSeriesRequestResult;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

/**
 *
 * Unit tests for {@link IntradayPriceTimeSeriesRetrieverService}
 *
 */

@RunWith(MockitoJUnitRunner.class)
public class IntradayPriceTimeSeriesRetrieverServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private MarketDataProviderRestAPI marketDataProviderRestAPI;

    private IntradayPriceTimeSeriesRetrieverService intradayPriceTimeSeriesRetrieverService;

    @Before
    public void setup() {
        intradayPriceTimeSeriesRetrieverService = new IntradayPriceTimeSeriesRetrieverService(restTemplate, marketDataProviderRestAPI, 1);
    }

    @Test
    public void shouldReturnsDailyPriceTimeSeriesRequestResultClass() {
        // Given

        // When
        Class<? extends BasePriceTimeSeriesRequestResult> clazz = intradayPriceTimeSeriesRetrieverService.getSearchResultClass();

        // Then
        assertThat(clazz).isEqualTo(IntradayPriceTimeSeriesRequestResult.class);
    }

    @Test
    public void shouldCallinstrumentDataProviderRestAPIGetDailyTimeseriesUrl() {
        // Given
        String symbol = "symbol";

        // When
        intradayPriceTimeSeriesRetrieverService.getTimeSeriesUrl(symbol);

        // Then
        verify(marketDataProviderRestAPI).getIntradayTimeseriesUrl(symbol);
    }
}
