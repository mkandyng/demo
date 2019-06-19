export const DAILY_TIMESERIES = ({
    FETCH_DAILY_TIMESERIES: "FETCH_DAILY_TIMESERIES",
    FETCH_DAILY_TIMESERIES_SUCCESS: "FETCH_DAILY_TIMESERIES_SUCCESS",
    FETCH_DAILY_TIMESERIES_FAILURE: "FETCH_DAILY_TIMESERIES_FAILURE",
});

export const fetchDailyTimeSeries = symbol => ({
    type: DAILY_TIMESERIES.FETCH_DAILY_TIMESERIES,
    symbol: symbol
});

export const fetchDailyTimeSeriesSuccess = timeSeries => ({
    type: DAILY_TIMESERIES.FETCH_DAILY_TIMESERIES_SUCCESS,
    dailyTimeSeries: timeSeries
});

export const fetchDailyTimeSeriesFailure = errorMessage => ({
    type: DAILY_TIMESERIES.FETCH_DAILY_TIMESERIES_FAILURE,
    error: errorMessage
});
