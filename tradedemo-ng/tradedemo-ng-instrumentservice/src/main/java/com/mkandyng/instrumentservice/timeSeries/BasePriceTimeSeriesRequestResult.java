package com.mkandyng.instrumentservice.timeSeries;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;
import java.util.Optional;

/**
 * Base class support Intraday and Daily Price results
 */

@JsonIgnoreProperties(ignoreUnknown = true)
abstract public class BasePriceTimeSeriesRequestResult {

    Optional<TimeSeries[]> getTimeSeries() {
        if(getMapTimeSeries() == null) {
            return Optional.empty();
        } else {
            return Optional.of(getMapTimeSeries().entrySet()
                    .stream()
                    .map(BasePriceTimeSeriesRequestResult::convertJsonMapToTimeSeries)
                    .toArray(TimeSeries[]::new));
        }
    }

    abstract protected Map<String, Map<String, Number>> getMapTimeSeries();

    private static TimeSeries convertJsonMapToTimeSeries(
                Map.Entry<String, Map<String, Number>> entry) {
        Map<String, Number> jsonMap = entry.getValue();
        TimeSeries timeSeries = new TimeSeries(
                entry.getKey(),
                jsonMap.get("1. open").doubleValue(),
                jsonMap.get("2. high").doubleValue(),
                jsonMap.get("3. low").doubleValue(),
                jsonMap.get("4. close").doubleValue(),
                jsonMap.get("5. volume").longValue()
        );
        return timeSeries;
    }
}
