package com.mkandyng.instrumentservice.timeSeries;

import org.junit.Test;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 *
 * Unit tests for {@link BasePriceTimeSeriesRequestResult}
 *
 */

public class BasePriceTimeSeriesRequestResultTest {
    private BasePriceTimeSeriesRequestResult priceTimeSeriesRequestResult;

    @Test
    public void shouldReturnOptionalEmptyWhenTimeSeriesIsNull() {
        // Given
        priceTimeSeriesRequestResult = new BasePriceTimeSeriesRequestResult() {
            @Override
            protected Map<String, Map<String, Number>> getMapTimeSeries() {
                return null;
            }
        };

        // When
        Optional<TimeSeries []> timeSeries = priceTimeSeriesRequestResult.getTimeSeries();

        // Then
        assertThat(timeSeries).isEqualTo(Optional.empty());

    }

    @Test
    public void shouldReturnOptionalTimeSeriesWhenTimeSeriesIsNotNull() {
        // Given
        TimeSeries timeSeries = new TimeSeries("2018-11-12", 1.0, 1.0, 1.0, 1.0, 1L);
        priceTimeSeriesRequestResult = new BasePriceTimeSeriesRequestResult() {
            @Override
            protected Map<String, Map<String, Number>> getMapTimeSeries() {
                Map<String, Map<String, Number>> mapTimeSeries = new HashMap<>();
                Map<String, Number> jsonTimeSeries = new HashMap<>();
                jsonTimeSeries.put("1. open", timeSeries.getOpen());
                jsonTimeSeries.put("2. high", timeSeries.getHigh());
                jsonTimeSeries.put("3. low", timeSeries.getLow());
                jsonTimeSeries.put("4. close", timeSeries.getClose());
                jsonTimeSeries.put("5. volume", timeSeries.getVolume());
                mapTimeSeries.put(timeSeries.getDateTime(), jsonTimeSeries);
                return mapTimeSeries;
            }
        };

        // When
        TimeSeries[] priceTimeSeries = priceTimeSeriesRequestResult.getTimeSeries()
                .orElseThrow(() -> new RuntimeException("No timeSeries"));

        // Then
        assertThat(priceTimeSeries[0]).isEqualTo(timeSeries);
    }

}
