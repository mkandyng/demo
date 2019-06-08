package com.mkandyng.instrumentservice.dataprovider;

/**
 * MarketData REST API provider interface
 */
public interface MarketDataProviderRestAPI {
    String getInstrumentsSearchUrl(String symbolSearch);
    String getInstrumentQuotesUrl(String symbol);
    String getDailyTimeseriesUrl(String symbol);
    String getIntradayTimeseriesUrl(String symbol);
}
