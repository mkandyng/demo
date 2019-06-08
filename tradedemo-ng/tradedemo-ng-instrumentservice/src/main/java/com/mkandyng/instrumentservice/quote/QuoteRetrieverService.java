package com.mkandyng.instrumentservice.quote;

import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 *  Service layer to Encapsulate the retrieval of quote, dependency on the
 *  injected marketDataProviderRestAPI.
 *
 *  A max retry of 20 is setup as the current marketDataProvider occasionally
 *  not deliver result. A cache of 1 hour is setup so that it fulfil the demo to produce
 *  a delay good enough simulation of market data price
 *
 */

public class QuoteRetrieverService {
    private static final Logger logger = LoggerFactory.getLogger(QuoteRetrieverService.class);

    private final RestTemplate restTemplate;
    private final LoadingCache<String, Quote> instrumentQuoteCache;
    private final MarketDataProviderRestAPI marketDataProviderRestAPI;
    private final int maxRetry;

    public QuoteRetrieverService(RestTemplate restTemplate,
                                 MarketDataProviderRestAPI marketDataProviderRestAPI,
                                 int maxRetry) {
        this.restTemplate = restTemplate;
        this.marketDataProviderRestAPI = marketDataProviderRestAPI;
        this.maxRetry = maxRetry;
        instrumentQuoteCache = setupQuoteCache();
    }

    public Quote getQuote(String symbol) {
        Quote quote = null;
        try {
            quote = instrumentQuoteCache.getUnchecked(symbol);
        } catch (Exception e) {
            logger.error("Exception on quote search with symbol=" + symbol, e);
        }
        return quote;
    }

    private LoadingCache<String, Quote> setupQuoteCache() {
        CacheLoader<String, Quote> loader = new CacheLoader<String, Quote>() {
            @Override
            public Quote load(String symbol) {
                return loadQuotes(symbol, maxRetry);
            }

            private Quote loadQuotes(String symbol, int count) {
                Optional<Quote> quotes = retrieveQuotes(symbol);
                return quotes.orElseGet(() -> {
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    return count > 1 ? loadQuotes(symbol, count - 1) : null;
                });
            }
        };

        return CacheBuilder.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .build(loader);
    }

    private Optional<Quote> retrieveQuotes(String symbol) {
        String instrumentQuotesUrl = marketDataProviderRestAPI.getInstrumentQuotesUrl(symbol);
        logger.info("Loading Quotes from from remote rest service {} for symbol {} and search class {}",
                instrumentQuotesUrl, symbol, Quote.class.getSimpleName());
        QuoteRequestResult quoteSearchResult = restTemplate.getForObject(
                instrumentQuotesUrl,
                QuoteRequestResult.class);
        return quoteSearchResult.getQuote();
    }
}
