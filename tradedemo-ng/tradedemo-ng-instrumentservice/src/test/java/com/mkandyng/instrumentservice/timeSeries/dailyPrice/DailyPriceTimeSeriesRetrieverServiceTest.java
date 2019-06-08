package com.mkandyng.instrumentservice.timeSeries.dailyPrice;

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
 * Unit tests for {@link DailyPriceTimeSeriesRetrieverService}
 *
 */

@RunWith(MockitoJUnitRunner.class)
public class DailyPriceTimeSeriesRetrieverServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private MarketDataProviderRestAPI marketDataProviderRestAPI;

    private DailyPriceTimeSeriesRetrieverService dailyPriceTimeSeriesRetrieverService;

    @Before
    public void setup() {
        dailyPriceTimeSeriesRetrieverService = new DailyPriceTimeSeriesRetrieverService(restTemplate, marketDataProviderRestAPI, 1);
    }

    @Test
    public void shouldReturnsDailyPriceTimeSeriesRequestResultClass() {
        // Given

        // When
        Class<? extends BasePriceTimeSeriesRequestResult> clazz = dailyPriceTimeSeriesRetrieverService.getSearchResultClass();

        // Then
        assertThat(clazz).isEqualTo(DailyPriceTimeSeriesRequestResult.class);
    }

    @Test
    public void shouldCallinstrumentDataProviderRestAPIGetDailyTimeseriesUrl() {
        // Given
        String symbol = "symbol";

        // When
        dailyPriceTimeSeriesRetrieverService.getTimeSeriesUrl(symbol);

        // Then
        verify(marketDataProviderRestAPI).getDailyTimeseriesUrl(symbol);
    }
}
