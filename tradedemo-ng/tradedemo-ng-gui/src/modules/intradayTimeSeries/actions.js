export const types = {
    FETCH_INTRADAY_TIMESERIES: "intradayTimeSeries/FETCH_INTRADAY_TIMESERIES",
    FETCH_INTRADAY_TIMESERIES_SUCCESS: "intradayTimeSeries/FETCH_INTRADAY_TIMESERIES_SUCCESS",
    FETCH_INTRADAY_TIMESERIES_FAILURE: "intradayTimeSeries/FETCH_INTRADAY_TIMESERIES_FAILURE"
}

export const fetchIntradayTimeSeries = symbol => ({
    type: types.FETCH_INTRADAY_TIMESERIES,
    symbol: symbol
});

export const fetchIntradayTimeSeriesSuccess = timeSeries => ({
    type: types.FETCH_INTRADAY_TIMESERIES_SUCCESS,
    intradayTimeSeries: timeSeries
});

export const fetchIntradayTimeSeriesFailure = errorMessage => ({
    type: types.FETCH_INTRADAY_TIMESERIES_FAILURE,
    error: errorMessage
});
