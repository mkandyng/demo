export const types = {
  FETCH_DAILY_TIMESERIES: "timeSeries/FETCH_DAILY_TIMESERIES",
  FETCH_DAILY_TIMESERIES_SUCCESS: "timeSeries/FETCH_DAILY_TIMESERIES_SUCCESS",
  FETCH_DAILY_TIMESERIES_FAILURE: "timeSeries/FETCH_DAILY_TIMESERIES_FAILURE",
  FETCH_INTRADAY_TIMESERIES: "timeSeries/FETCH_INTRADAY_TIMESERIES",
  FETCH_INTRADAY_TIMESERIES_SUCCESS: "timeSeries/FETCH_INTRADAY_TIMESERIES_SUCCESS",
  FETCH_INTRADAY_TIMESERIES_FAILURE: "timeSeries/FETCH_INTRADAY_TIMESERIES_FAILURE"
}

export const fetchDailyTimeSeries = symbol => ({
  type: types.FETCH_DAILY_TIMESERIES,
  symbol: symbol
});

export const fetchDailyTimeSeriesSuccess = (symbol, timeSeries) => ({
  type: types.FETCH_DAILY_TIMESERIES_SUCCESS,
  symbol: symbol,
  timeSeries: timeSeries
});

export const fetchDailyTimeSeriesFailure = errorMessage => ({
  type: types.FETCH_DAILY_TIMESERIES_FAILURE,
  error: errorMessage
});

export const fetchIntradayTimeSeries = symbol => ({
  type: types.FETCH_INTRADAY_TIMESERIES,
  symbol: symbol
});

export const fetchIntradayTimeSeriesSuccess = (symbol, timeSeries) => ({
  type: types.FETCH_INTRADAY_TIMESERIES_SUCCESS,
  symbol: symbol,
  timeSeries: timeSeries
});

export const fetchIntradayTimeSeriesFailure = errorMessage => ({
  type: types.FETCH_INTRADAY_TIMESERIES_FAILURE,
  error: errorMessage
});
