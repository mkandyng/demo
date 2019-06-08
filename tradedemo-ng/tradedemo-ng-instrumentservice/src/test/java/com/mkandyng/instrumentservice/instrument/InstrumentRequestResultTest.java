package com.mkandyng.instrumentservice.instrument;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.springframework.boot.test.json.JacksonTester;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 *
 * Unit tests for {@link InstrumentRequestResult}
 *
 */

public class InstrumentRequestResultTest {

    private JacksonTester<Map<String, List<Map<String, String>>>> jsonInstrument;

    @Before
    public void setup() {
        JacksonTester.initFields(this, new ObjectMapper());
    }

    @Test
    public void shouldReturnsEmptyInstrumentsIsNull() throws Exception {
        // Given
        InstrumentRequestResult instrumentRequestResult = getInstrumentRequestResult("invalid");

        // When
        List<Instrument> instruments = instrumentRequestResult.getInstruments();

        // Then
        Assertions.assertThat(instruments).isEmpty();
    }

    @Test
    public void shouldReturnsInstrumentsWhenNotEmpty() throws Exception {
        // Given
        InstrumentRequestResult instrumentRequestResult = getInstrumentRequestResult(InstrumentRequestResult.JSON_PROPERTY_MATCHVALUE);

        // When
        List<Instrument> instruments = instrumentRequestResult.getInstruments();

        // Then
        assertThat(instruments.get(0)).isEqualTo(new Instrument("symbol", "name", "usd"));
    }

    private InstrumentRequestResult getInstrumentRequestResult(String jsonProperty) throws IOException {
        // Given
        Map<String, List<Map<String, String>>> bestMatchesLookup = new HashMap<>();
        List<Map<String, String>> listJsonMap = new ArrayList<>();
        Map<String, String> jsonMap = new HashMap<>();
        jsonMap.put("1. symbol", "symbol");
        jsonMap.put("2. name", "name");
        jsonMap.put("8. currency", "usd");
        listJsonMap.add(jsonMap);
        bestMatchesLookup.put(jsonProperty, listJsonMap);

        String json = jsonInstrument.write(bestMatchesLookup).getJson();

        InstrumentRequestResult result = new ObjectMapper().readValue(json, InstrumentRequestResult.class);

        // When
        return result;
    }
}
