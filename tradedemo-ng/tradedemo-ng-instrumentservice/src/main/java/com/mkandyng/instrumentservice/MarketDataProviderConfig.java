package com.mkandyng.instrumentservice;

import com.mkandyng.instrumentservice.dataprovider.AlphaVantageRestAPI;
import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;

/**
 *
 * Define Beans used by controller to inject dependencies
 * This bean is defined separately so that it can be override to provide
 * hardcoded Rest API results during regression tests
 *
 */

@Configuration
@PropertySource("classpath:application.properties")
@Profile("production")
public class MarketDataProviderConfig {
    @Bean
    public MarketDataProviderRestAPI marketDataProviderRestAPI(@Value("${apikey}") String apiKey) {
        return new AlphaVantageRestAPI(apiKey);
    }
}