package com.mkandyng.instrumentservice.timeSeries;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 *
 *  Encapsulate the core retrieval of time series to provide templating methods to allow
 *  subclass to customised to specific price time series
 *
 **/

public abstract class BasePriceTimeSeriesRetrieverService {

    private static final Logger logger = LoggerFactory.getLogger(BasePriceTimeSeriesRetrieverService.class);

    private final RestTemplate restTemplate;
    private final LoadingCache<String, TimeSeries[]> timeSeriesCache;
    private final int maxRetry;

    public BasePriceTimeSeriesRetrieverService(RestTemplate restTemplate, int maxRetry) {
        this.restTemplate = restTemplate;
        this.maxRetry = maxRetry;
        this.timeSeriesCache = setupTimeSeriesCache(TimeUnit.HOURS.toHours(12));
    }

    public List<TimeSeries> getTimeSeries(String symbol) {
        List<TimeSeries> listTimeSeries = new ArrayList<>();
        try {
            listTimeSeries.addAll(Arrays.asList(timeSeriesCache.getUnchecked(symbol)));
        } catch (Exception e) {
            logger.error("Exception on timeSeries search with symbol=" + symbol, e);
        }
        return listTimeSeries;
    }

    protected abstract Class<? extends BasePriceTimeSeriesRequestResult> getSearchResultClass();

    protected abstract String getTimeSeriesUrl(String symbol);

    private LoadingCache<String, TimeSeries[]> setupTimeSeriesCache(
            long expiredInHour) {
        CacheLoader<String, TimeSeries[]> loader = new CacheLoader<String, TimeSeries[]>() {
            @Override
            public TimeSeries[] load(String symbol) {
                return loadTimeSeries(symbol, maxRetry);
            }

            private TimeSeries[] loadTimeSeries(String symbol, int count) {
                return retrieveTimeSeries(symbol).orElseGet(() -> {
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    return count > 1 ? loadTimeSeries(symbol, count - 1) : new TimeSeries[0];
                });
            }

        };

        return CacheBuilder.newBuilder()
                .expireAfterWrite(expiredInHour, TimeUnit.HOURS)
                .build(loader);
    }

    private Optional<TimeSeries[]> retrieveTimeSeries(String symbol) {
        String priceUrl = getTimeSeriesUrl(symbol);
        Class<? extends BasePriceTimeSeriesRequestResult> searchResultClazz = getSearchResultClass();
        logger.info("Loading time series from from remote rest service {} for symbol {} and search class {}",
                                                            priceUrl, symbol, searchResultClazz.getSimpleName());
        BasePriceTimeSeriesRequestResult pricesSearchResult =
                restTemplate.getForObject(getTimeSeriesUrl(symbol), searchResultClazz);
        return pricesSearchResult.getTimeSeries();
    }
}
