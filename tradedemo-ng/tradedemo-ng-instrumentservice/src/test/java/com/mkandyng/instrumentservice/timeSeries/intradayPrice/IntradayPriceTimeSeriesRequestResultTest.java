package com.mkandyng.instrumentservice.timeSeries.intradayPrice;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.test.context.junit4.SpringRunner;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 *
 * Unit tests for {@link IntradayPriceTimeSeriesRequestResult}
 *
 */

@RunWith(SpringRunner.class)
public class IntradayPriceTimeSeriesRequestResultTest {

    private JacksonTester<Map<String,Map<String, Map<String, Number>>>> jsonTimeSeries;

    @Before
    public void setup() {
        JacksonTester.initFields(this, new ObjectMapper());
    }

    @Test
    public void shouldReturnTimeSeriesForMappedJSONPayload() throws IOException {
        Map<String, Map<String, Number>> timeSeries = getTimeSeries(IntradayPriceTimeSeriesRequestResult.JSON_PROPERTY_MATCHVALUE);
        assertThat(timeSeries).isNotNull();
    }

    @Test
    public void shouldReturnNullWhenNotMappedJSONPayload() throws IOException {
        Map<String, Map<String, Number>> timeSeries = getTimeSeries("Time Series (INVALID)");
        assertThat(timeSeries).isNull();
    }

    private Map<String, Map<String, Number>> getTimeSeries(String jsonProperty) throws IOException {
        // Given
        Map<String,Map<String, Map<String, Number>>> mapPricesTimeSeries = new HashMap<>();
        mapPricesTimeSeries.put(jsonProperty, new HashMap<>());
        String json = jsonTimeSeries.write(mapPricesTimeSeries).getJson();

        IntradayPriceTimeSeriesRequestResult result = new ObjectMapper().readValue(json, IntradayPriceTimeSeriesRequestResult.class);

        // When
        return result.getMapTimeSeries();
    }


}
