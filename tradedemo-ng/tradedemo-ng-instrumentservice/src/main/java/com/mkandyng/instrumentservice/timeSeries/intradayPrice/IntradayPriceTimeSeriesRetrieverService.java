package com.mkandyng.instrumentservice.timeSeries.intradayPrice;

import com.mkandyng.instrumentservice.timeSeries.BasePriceTimeSeriesRetrieverService;
import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;
import com.mkandyng.instrumentservice.timeSeries.BasePriceTimeSeriesRequestResult;
import org.springframework.web.client.RestTemplate;

/**
 *
 *  Service layer to Encapsulate the retrieval of intraday price time series, extending the
 *  BasePriceTimeSeriesRetrieverService
 *
 **/

public class IntradayPriceTimeSeriesRetrieverService extends BasePriceTimeSeriesRetrieverService {
    private MarketDataProviderRestAPI marketDataProviderRestAPI;

    public IntradayPriceTimeSeriesRetrieverService(RestTemplate restTemplate,
                                                   MarketDataProviderRestAPI marketDataProviderRestAPI,
                                                   int maxRetry) {
        super(restTemplate, maxRetry);
        this.marketDataProviderRestAPI = marketDataProviderRestAPI;
    }

    @Override
    protected Class<? extends BasePriceTimeSeriesRequestResult> getSearchResultClass() {
        return IntradayPriceTimeSeriesRequestResult.class;
    }

    @Override
    protected String getTimeSeriesUrl(String symbol) {
        return marketDataProviderRestAPI.getIntradayTimeseriesUrl(symbol);
    }
}
