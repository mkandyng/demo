package com.mkandyng.instrumentservice.regressionTests;

import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;

/**
 * Define Beans to override for test
 */

@Configuration
@Profile("test")
@PropertySource("classpath:application.properties")
public class MarketDataProviderConfigOverride {
    @Bean
    @Primary
    public MarketDataProviderRestAPI marketDataProviderRestAPI(
            @Value("${server.port}") Integer serverPort) {
        return new FakeMarketDataProviderRestAPI(serverPort);
    }
}
