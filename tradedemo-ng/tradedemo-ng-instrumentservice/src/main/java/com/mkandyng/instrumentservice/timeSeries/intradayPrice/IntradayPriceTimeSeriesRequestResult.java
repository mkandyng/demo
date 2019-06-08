package com.mkandyng.instrumentservice.timeSeries.intradayPrice;

import com.mkandyng.instrumentservice.timeSeries.BasePriceTimeSeriesRequestResult;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

/**
 * Data mapping container for time series (intraday) request result
 */

@JsonIgnoreProperties(ignoreUnknown = true)
class IntradayPriceTimeSeriesRequestResult extends BasePriceTimeSeriesRequestResult {

    final static String JSON_PROPERTY_MATCHVALUE = "Time Series (30min)";

    @JsonProperty(JSON_PROPERTY_MATCHVALUE)
    private Map<String, Map<String, Number>> mapTimeSeries;

    @Override
    protected Map<String, Map<String, Number>> getMapTimeSeries() {
        return mapTimeSeries;
    }
}
