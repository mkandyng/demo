export const INTRADAY_TIMESERIES = ({
    FETCH_INTRADAY_TIMESERIES: "FETCH_INTRADAY_TIMESERIES",
    FETCH_INTRADAY_TIMESERIES_SUCCESS: "FETCH_INTRADAY_TIMESERIES_SUCCESS",
    FETCH_INTRADAY_TIMESERIES_FAILURE: "FETCH_INTRADAY_TIMESERIES_FAILURE"
})

export const fetchIntradayTimeSeries = symbol => ({
    type: INTRADAY_TIMESERIES.FETCH_INTRADAY_TIMESERIES,
    symbol: symbol
});

export const fetchIntradayTimeSeriesSuccess = timeSeries => ({
    type: INTRADAY_TIMESERIES.FETCH_INTRADAY_TIMESERIES_SUCCESS,
    intradayTimeSeries: timeSeries
});

export const fetchIntradayTimeSeriesFailure = errorMessage => ({
    type: INTRADAY_TIMESERIES.FETCH_INTRADAY_TIMESERIES_FAILURE,
    error: errorMessage
});
