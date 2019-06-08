package com.mkandyng.instrumentservice;

import com.mkandyng.instrumentservice.dataprovider.AlphaVantageRestAPI;
import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;
import com.mkandyng.instrumentservice.instrument.InstrumentRetrieverService;
import com.mkandyng.instrumentservice.quote.QuoteRetrieverService;
import com.mkandyng.instrumentservice.timeSeries.dailyPrice.DailyPriceTimeSeriesRetrieverService;
import com.mkandyng.instrumentservice.timeSeries.intradayPrice.IntradayPriceTimeSeriesRetrieverService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.client.RestTemplate;

/**
 * Define Beans used by controller to inject dependencies
 */

@Configuration
@PropertySource("classpath:application.properties")
public class ApplicationConfig {
    private static final String INSTRUMENT_SPLIT_DELIMITER = ",";

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public InstrumentRetrieverService instrumentsRetrieverService(
            RestTemplate restTemplate,
            MarketDataProviderRestAPI marketDataProviderRestAPI,
            @Value("${instrumentPrefixList}") String instrumentPrefixListProp) {
        String[] instrumentPrefixList = instrumentPrefixListProp.split(INSTRUMENT_SPLIT_DELIMITER);
        return new InstrumentRetrieverService(restTemplate, marketDataProviderRestAPI, instrumentPrefixList);
    }

    @Bean
    public QuoteRetrieverService instrumentQuotesRetrieverService(
            RestTemplate restTemplate,
            MarketDataProviderRestAPI marketDataProviderRestAPI,
            @Value("${max.retry}") int maxRetry) {
        return new QuoteRetrieverService(restTemplate, marketDataProviderRestAPI, maxRetry);
    }

    @Bean (name = "intradayPriceTimeSeriesRetrieverService")
    public IntradayPriceTimeSeriesRetrieverService intradayPriceTimeSeriesRetrieverService (
            RestTemplate restTemplate,
            MarketDataProviderRestAPI marketDataProviderRestAPI,
            @Value("${max.retry}") int maxRetry) {
        return new IntradayPriceTimeSeriesRetrieverService(restTemplate, marketDataProviderRestAPI, maxRetry);
    }

    @Bean (name = "dailyPriceTimeSeriesRetrieverService")
    public DailyPriceTimeSeriesRetrieverService dailyPriceTimeSeriesRetrieverService(
            RestTemplate restTemplate,
            MarketDataProviderRestAPI marketDataProviderRestAPI,
            @Value("${max.retry}") int maxRetry) {
        return new DailyPriceTimeSeriesRetrieverService(restTemplate, marketDataProviderRestAPI, maxRetry);
    }

}
