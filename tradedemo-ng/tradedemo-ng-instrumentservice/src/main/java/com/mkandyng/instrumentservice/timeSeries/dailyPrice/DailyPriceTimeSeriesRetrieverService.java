package com.mkandyng.instrumentservice.timeSeries.dailyPrice;

import com.mkandyng.instrumentservice.timeSeries.BasePriceTimeSeriesRequestResult;
import com.mkandyng.instrumentservice.timeSeries.BasePriceTimeSeriesRetrieverService;
import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;
import org.springframework.web.client.RestTemplate;

/**
 *
 *  Service layer to Encapsulate the retrieval of daily price time series, extending the
 *  BasePriceTimeSeriesRetrieverService
 *
 **/
public class DailyPriceTimeSeriesRetrieverService extends BasePriceTimeSeriesRetrieverService {

    private MarketDataProviderRestAPI marketDataProviderRestAPI;

    public DailyPriceTimeSeriesRetrieverService(RestTemplate restTemplate,
                                                MarketDataProviderRestAPI instrumentDataProviderRestAPI,
                                                int maxRetry) {
        super(restTemplate, maxRetry);
        this.marketDataProviderRestAPI = instrumentDataProviderRestAPI;
    }

    @Override
    protected Class<? extends BasePriceTimeSeriesRequestResult> getSearchResultClass() {
        return DailyPriceTimeSeriesRequestResult.class;
    }

    @Override
    protected String getTimeSeriesUrl(String symbol) {
        return marketDataProviderRestAPI.getDailyTimeseriesUrl(symbol);
    }
}
