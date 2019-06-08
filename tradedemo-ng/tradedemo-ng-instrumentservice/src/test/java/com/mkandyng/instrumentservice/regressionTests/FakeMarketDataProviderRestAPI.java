package com.mkandyng.instrumentservice.regressionTests;

import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;

/**
 *
 * Fake Rest API implementing MarketDataProviderRestAPI interface
 * to support regressionTests end-2-end test
 *
 */
public class FakeMarketDataProviderRestAPI implements MarketDataProviderRestAPI {

    private static final String INSTRUMENTS_SEARCH_URL = "/marketdata/instruments_%s_input.json";
    private static final String INSTRUMENT_QUOTES_URL = "/marketdata/quote_%s_input.json";
    private static final String DAILY_TIMESERIES_URL = "/marketdata/dailyTimeSeries_%s_input.json";
    private static final String INTRADAY_TIMESERIES_URL = "/marketdata/intradayTimeSeries_%s_input.json";
    private final int localport;

    public FakeMarketDataProviderRestAPI(int localport) {
        this.localport = localport;
    }

    public String getInstrumentsSearchUrl(String symbolSearch) {
        return getTargetUrl(INSTRUMENTS_SEARCH_URL, symbolSearch);
    }

    public String getInstrumentQuotesUrl(String symbol) {
        return getTargetUrl(INSTRUMENT_QUOTES_URL, symbol);
    }

    public String getDailyTimeseriesUrl(String symbol) {
        return getTargetUrl(DAILY_TIMESERIES_URL, symbol);
    }

    public String getIntradayTimeseriesUrl(String symbol) {
        return getTargetUrl(INTRADAY_TIMESERIES_URL, symbol);
    }

    private String getTargetUrl(String url, String symbolReplacement) {
        return String.format("http://localhost:" + localport + url, symbolReplacement);
    }

}