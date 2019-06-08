package com.mkandyng.instrumentservice.timeSeries.dailyPrice;

import com.mkandyng.instrumentservice.timeSeries.BasePriceTimeSeriesRequestResult;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

/**
 * Data mapping container for time series (daily) request result
 */

@JsonIgnoreProperties(ignoreUnknown = true)
class DailyPriceTimeSeriesRequestResult extends BasePriceTimeSeriesRequestResult {

    final static String JSON_PROPERTY_MATCHVALUE = "Time Series (Daily)";

    @JsonProperty(JSON_PROPERTY_MATCHVALUE)
    private Map<String, Map<String, Number>> mapTimeSeries;

    @Override
    protected Map<String, Map<String, Number>> getMapTimeSeries() {
        return mapTimeSeries;
    }
}
