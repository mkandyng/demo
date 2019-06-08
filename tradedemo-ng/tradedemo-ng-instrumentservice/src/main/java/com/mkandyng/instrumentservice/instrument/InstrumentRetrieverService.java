package com.mkandyng.instrumentservice.instrument;

import com.mkandyng.instrumentservice.dataprovider.MarketDataProviderRestAPI;
import com.mkandyng.instrumentservice.quote.Quote;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 *
 * Service layer to Encapsulate the retrieval of instrument, dependency on the
 * injected marketDataProviderRestAPI
 *
 */
public class InstrumentRetrieverService {

    private static final Logger logger = LoggerFactory.getLogger(InstrumentRetrieverService.class);

    private Set<Instrument> instruments;
    private final RestTemplate restTemplate;
    private final MarketDataProviderRestAPI marketDataProviderRestAPI;
    private final String[] instrumentPrefixList;

    public InstrumentRetrieverService(
            RestTemplate restTemplate,
            MarketDataProviderRestAPI marketDataProviderRestAPI,
            String[] instrumentPrefixList) {
        this.restTemplate = restTemplate;
        this.marketDataProviderRestAPI = marketDataProviderRestAPI;
        this.instrumentPrefixList = instrumentPrefixList;
        this.instruments = new HashSet<>();
    }

    public Set<Instrument> getInstruments() {
        if(instruments.isEmpty()) {
            try {
                instruments.addAll(loadInstruments(instrumentPrefixList));
            } catch (Exception e) {
                logger.error("Exception on instruments search", e);
            }
        }
        return new HashSet<>(instruments);
    }

    private Set<Instrument> loadInstruments(String[] instrumentPrefixList) {
        Set<Instrument> instrumentSet = Arrays.stream(instrumentPrefixList)
                .map(marketDataProviderRestAPI::getInstrumentsSearchUrl)
                .peek(url -> logger.info("Loading instruments from remote rest service {}", url))
                .map(url -> restTemplate.getForObject(url, InstrumentRequestResult.class))
                .filter(retrieveInstruments -> retrieveInstruments != null)
                .filter(retrieveInstruments -> retrieveInstruments.getInstruments() != null)
                .flatMap(retrievedInstruments -> retrievedInstruments.getInstruments().stream())
                .collect(Collectors.toSet());
        logger.info("Instruments loaded {}", instrumentSet);
        return instrumentSet;
    }

}
