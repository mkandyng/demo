package com.mkandyng.instrumentservice.instrument;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Data mapping containers for instrument request result
 */
@JsonIgnoreProperties(ignoreUnknown = true)
class InstrumentRequestResult {

    private static final Logger logger = LoggerFactory.getLogger(InstrumentRequestResult.class);

    final static String JSON_PROPERTY_MATCHVALUE = "bestMatches";

    @JsonProperty(JSON_PROPERTY_MATCHVALUE)
    private List<Map<String,String>> instruments;

    List<Instrument> getInstruments() {
        if(instruments == null) {
            return Collections.emptyList();
        } else {
            return instruments.stream()
                    .map(InstrumentRequestResult::convertJsonMapToInstrument)
                    .collect(Collectors.toList());
        }
    }

    private static Instrument convertJsonMapToInstrument(Map<String, String> jsonMap) {
        return new Instrument(jsonMap.get("1. symbol"),
                              jsonMap.get("2. name"),
                              jsonMap.get("8. currency"));
    }
}
