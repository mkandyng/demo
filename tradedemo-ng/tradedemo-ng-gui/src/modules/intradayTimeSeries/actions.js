import * as types from './actionTypes';
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
