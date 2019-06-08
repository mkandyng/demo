package com.mkandyng.instrumentservice.quote;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.springframework.boot.test.json.JacksonTester;
import java.io.IOException;
import java.util.*;

/**
 *
 * Unit tests for {@link QuoteRequestResult}
 *
 */

public class QuoteRequestResultTest {
    private JacksonTester<Map<String, Map<String, String>>> jsonQuote;

    @Before
    public void setup() {
        JacksonTester.initFields(this, new ObjectMapper());
    }

    @Test
    public void shouldReturnsOptionalEmptyWhenQuoteIsNull() throws Exception {
        // Given
        QuoteRequestResult quoteRequestResult = getQuoteRequestResult("Invalid");

        // When
        Optional<Quote> quote = quoteRequestResult.getQuote();

        // Then
        Assertions.assertThat(quote).isEqualTo(Optional.empty());
    }

    @Test
    public void shouldReturnsOptionalQuoteWhenQuoteIsNotNull() throws Exception {
        // Given
        QuoteRequestResult quoteRequestResult = getQuoteRequestResult(QuoteRequestResult.JSON_PROPERTY_MATCHVALUE);

        // When
        Quote quote = quoteRequestResult.getQuote().orElse(null);

        // Then
        Assertions.assertThat(quote).isEqualTo(new Quote(1.0, 1.0, 1.0, 1.0, 1L, 1.0));
    }

    private QuoteRequestResult getQuoteRequestResult(String jsonProperty) throws IOException {
        // Given
        Map<String, Map<String, String>> globalQuoteLookup = new HashMap<>();
        Map<String, String> jsonMap = new HashMap<>();
        jsonMap.put("02. open", "1.0");
        jsonMap.put("03. high", "1.0");
        jsonMap.put("04. low", "1.0");
        jsonMap.put("05. price", "1.0");
        jsonMap.put("06. volume", "1");
        jsonMap.put("08. previous close", "1.0");
        globalQuoteLookup.put(jsonProperty, jsonMap);

        String json = jsonQuote.write(globalQuoteLookup).getJson();

        QuoteRequestResult result = new ObjectMapper().readValue(json, QuoteRequestResult.class);

        // When
        return result;
    }
}
