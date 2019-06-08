package com.mkandyng.instrumentservice.timeSeries;

import com.mkandyng.instrumentservice.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.function.Function;

/**
 *
 * Rest API to retrieve daily and intraday price time series
 *
 */

@RestController
public class TimeSeriesRequestController {

    private final BasePriceTimeSeriesRetrieverService intradayPriceTimeSeriesRetrieverService;
    private final BasePriceTimeSeriesRetrieverService dailyPriceTimeSeriesRetrieverService;

    public TimeSeriesRequestController(
            BasePriceTimeSeriesRetrieverService intradayPriceTimeSeriesRetrieverService,
            BasePriceTimeSeriesRetrieverService dailyPriceTimeSeriesRetrieverService) {
        this.intradayPriceTimeSeriesRetrieverService = intradayPriceTimeSeriesRetrieverService;
        this.dailyPriceTimeSeriesRetrieverService = dailyPriceTimeSeriesRetrieverService;
    }

    @GetMapping(value = "/intradayPrices/{symbol}")
    public List<TimeSeries> intradayPricesTimeSeries(@PathVariable String symbol) {
        return getRecords(symbol, intradayPriceTimeSeriesRetrieverService::getTimeSeries);
    }

    @GetMapping(value = "/dailyPrices/{symbol}")
    public List<TimeSeries> dailyPricesTimeSeries(@PathVariable String symbol) {
        return getRecords(symbol, dailyPriceTimeSeriesRetrieverService::getTimeSeries);
    }

    private static <T> List<T> getRecords(String symbol, Function<String, List<T>> function) {
        List<T> records = function.apply(symbol);
        if(records.isEmpty()) {
            throw new ResourceNotFoundException(String.format("No TimeSeries found for symbol [%s]", symbol));
        }
        return records;
    }

}