package com.mkandyng.instrumentservice.timeSeries;

import ch.qos.logback.classic.Level;
import com.mkandyng.instrumentservice.TestHelperUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

/**
 *
 * Unit tests for {@link BasePriceTimeSeriesRetrieverService}
 *
 */

@RunWith(MockitoJUnitRunner.class)
public class BasePriceTimeSeriesRetrieverServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private BasePriceTimeSeriesRequestResult basePriceTimeSeriesRequestResult;

    private BasePriceTimeSeriesRetrieverService priceTimeSeriesRetrieverService;

    private TestHelperUtils testHelperUtils;

    private String url;
    private int maxRetry;
    private String symbol;

    @Before
    public void setup() {
        url = "url";
        symbol = "symbol";
        maxRetry = 1;
        testHelperUtils = new TestHelperUtils();
        given(restTemplate.getForObject(url, BasePriceTimeSeriesRequestResult.class)).willReturn(basePriceTimeSeriesRequestResult);
        priceTimeSeriesRetrieverService = new BasePriceTimeSeriesRetrieverService(restTemplate, maxRetry) {
            @Override
            protected Class<? extends BasePriceTimeSeriesRequestResult> getSearchResultClass() {
                return BasePriceTimeSeriesRequestResult.class;
            }

            @Override
            protected String getTimeSeriesUrl(String symbol) {
                return "url";
            }
        };
    }

    @Test
    public void shouldReturnTimeSeriesForSymbolWhenResultIsNotEmpty() {
        // Given
        TimeSeries[] expectedTmeSeries = new TimeSeries[]{mock(TimeSeries.class)};
        given(basePriceTimeSeriesRequestResult.getTimeSeries()).willReturn(Optional.of(expectedTmeSeries));

        // When
        List<TimeSeries> timeSeries = priceTimeSeriesRetrieverService.getTimeSeries(symbol);

        // Then
        assertThat(timeSeries).isNotEmpty();
    }

    @Test
    public void shouldReturnEmptyListAfterRetryWhenResultIsOptionalEmpty() {
        // Given
        int maxRetry = 2;
        priceTimeSeriesRetrieverService = new BasePriceTimeSeriesRetrieverService(restTemplate, maxRetry) {
            @Override
            protected Class<? extends BasePriceTimeSeriesRequestResult> getSearchResultClass() {
                return BasePriceTimeSeriesRequestResult.class;
            }

            @Override
            protected String getTimeSeriesUrl(String symbol) {
                return "url";
            }
        };
        given(basePriceTimeSeriesRequestResult.getTimeSeries()).willReturn(Optional.empty());

        // When
        List<TimeSeries> timeSeries = priceTimeSeriesRetrieverService.getTimeSeries(symbol);

        // Then
        assertThat(timeSeries).isEmpty();
        verify(restTemplate, times(maxRetry)).getForObject(
                Mockito.anyString(), eq(BasePriceTimeSeriesRequestResult.class)
        );

    }

    @Test
    public void shouldLogErrorWhenExceptionThrownInRestCall() {
        // Given
        restTemplate = mock(RestTemplate.class);
        given(restTemplate.getForObject(url, BasePriceTimeSeriesRequestResult.class)).willThrow(new RuntimeException("error"));
        priceTimeSeriesRetrieverService = new BasePriceTimeSeriesRetrieverService(restTemplate, maxRetry) {
            @Override
            protected Class<? extends BasePriceTimeSeriesRequestResult> getSearchResultClass() {
                return BasePriceTimeSeriesRequestResult.class;
            }

            @Override
            protected String getTimeSeriesUrl(String symbol) {
                return "url";
            }
        };

        // When
        List<TimeSeries> timeSeries = priceTimeSeriesRetrieverService.getTimeSeries(symbol);


        // Then
        testHelperUtils.verifyLoggedMessage(Level.ERROR, "Exception on timeSeries search with symbol");
        assertThat(timeSeries).isEmpty();

    }

}
