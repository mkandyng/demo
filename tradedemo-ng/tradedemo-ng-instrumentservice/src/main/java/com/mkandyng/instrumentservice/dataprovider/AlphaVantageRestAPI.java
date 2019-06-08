package com.mkandyng.instrumentservice.dataprovider;

/**
 *
 * Encapsulate the Market data provider Rest API
 *
 * When URL is constructed, it includes the apiKey
 *
 */
public class AlphaVantageRestAPI implements MarketDataProviderRestAPI {

    public static final String API_PREFIX = "https://www.alphavantage.co/query?function=";

    private static final String INSTRUMENTS_SEARCH_URL = API_PREFIX + "SYMBOL_SEARCH&keywords=%s";
    private static final String INSTRUMENT_QUOTES_URL = API_PREFIX + "GLOBAL_QUOTE&symbol=%s";
    private static final String DAILY_TIMESERIES_URL = API_PREFIX + "TIME_SERIES_DAILY&symbol=%s";
    private static final String INTRADAY_TIMESERIES_URL = API_PREFIX + "TIME_SERIES_INTRADAY&symbol=%s&interval=30min";

    private final String apiKey;

    public AlphaVantageRestAPI(String apiKey) {
        this.apiKey = apiKey;
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
        return String.format(url, symbolReplacement) + String.format("&apikey=%s", apiKey);
    }

}
