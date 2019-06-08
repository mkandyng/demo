package com.mkandyng.instrumentservice.quote;

import ch.qos.logback.classic.Level;
import com.mkandyng.instrumentservice.TestHelperUtils;
import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.web.client.RestTemplate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

/**
 *
 * Unit tests for {@link QuoteRetrieverService}
 *
 */

@RunWith(MockitoJUnitRunner.Silent.class)
public class QuoteRetrieverServiceTest {
    private QuoteRetrieverService quoteRetrieverService;

    @Mock
    private RestTemplate restTemplate;
    @Mock
    private MarketDataProviderRestAPI marketDataProviderRestAPI;
    @Mock
    private QuoteRequestResult quoteRequestResult;

    private TestHelperUtils testHelperUtils;

    private String url;
    private int maxRetry;
    private String symbol;

    @Before
    public void setup() {
        maxRetry = 1;
        url = "url";
        symbol = "symbol";
        testHelperUtils = new TestHelperUtils();
        given(marketDataProviderRestAPI.getInstrumentQuotesUrl("symbol")).willReturn(url);
        given(restTemplate.getForObject(url, QuoteRequestResult.class)).willReturn(quoteRequestResult);
        quoteRetrieverService = new QuoteRetrieverService(restTemplate, marketDataProviderRestAPI, maxRetry);
    }

    @Test
    public void shouldReturnQuoteForSymbolWhenResultIsNotEmpty() {
        // Given
        given(quoteRequestResult.getQuote()).willReturn(Optional.of(mock(Quote.class)));

        // When
        Quote quote = quoteRetrieverService.getQuote(symbol);

        // Then
        assertThat(quote).isNotNull();
    }

    public void shouldReturnNullWhenResultIsOptionalEmpty() {
        // Given
        given(quoteRequestResult.getQuote()).willReturn(Optional.empty());

        // When
        Quote quote = quoteRetrieverService.getQuote(symbol);

        // Then
        assertThat(quote).isNull();
    }

    @Test
    public void shouldRetryWhenResultIsOptionalEmpty() {
        // Given
        int maxRetry = 2;
        quoteRetrieverService = new QuoteRetrieverService(restTemplate, marketDataProviderRestAPI, maxRetry);
        given(quoteRequestResult.getQuote()).willReturn(Optional.empty());

        // When
        quoteRetrieverService.getQuote(symbol);

        // Then
        verify(restTemplate, times(maxRetry)).getForObject(Mockito.anyString(), eq(QuoteRequestResult.class));
        verify(marketDataProviderRestAPI, times(maxRetry)).getInstrumentQuotesUrl(symbol);
    }

    @Test
    public void shouldLogErrorWhenExceptionThrownInRestCall() {
        // Given
        restTemplate = mock(RestTemplate.class);
        marketDataProviderRestAPI = mock(MarketDataProviderRestAPI.class);
        given(restTemplate.getForObject(url, QuoteRequestResult.class)).willThrow(new RuntimeException("error"));
        quoteRetrieverService = new QuoteRetrieverService(restTemplate, marketDataProviderRestAPI, maxRetry);

        // When
        Quote quote = quoteRetrieverService.getQuote(symbol);


        // Then
        testHelperUtils.verifyLoggedMessage(Level.ERROR, "Exception on quote search with symbol");
        assertThat(quote).isNull();

    }
}
