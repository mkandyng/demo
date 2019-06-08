package com.mkandyng.instrumentservice.quote;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;
import java.util.Optional;

/**
 * Data mapping containers for the Quote
 */

@JsonIgnoreProperties(ignoreUnknown = true)
class QuoteRequestResult {

    final static String JSON_PROPERTY_MATCHVALUE = "Global Quote";

    @JsonProperty(JSON_PROPERTY_MATCHVALUE)
    private Map<String, String> quote;

    Optional<Quote> getQuote() {
        return Optional.ofNullable(quote)
                .map(e -> Optional.of(convertJsonMapToQuote(e)))
                .orElse(Optional.empty());
    }

    private static Quote convertJsonMapToQuote(Map<String, String> jsonMap) {
        return new Quote(
                Double.valueOf(jsonMap.get("02. open")),
                Double.valueOf(jsonMap.get("03. high")),
                Double.valueOf(jsonMap.get("04. low")),
                Double.valueOf(jsonMap.get("05. price")),
                Long.valueOf(jsonMap.get("06. volume")),
                Double.valueOf(jsonMap.get("08. previous close"))
        );
    }
}
