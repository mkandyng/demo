import * as types from './actionTypes';

export const fetchDailyTimeSeries = symbol => ({
    type: types.FETCH_DAILY_TIMESERIES,
    symbol: symbol
});

export const fetchDailyTimeSeriesSuccess = timeSeries => ({
    type: types.FETCH_DAILY_TIMESERIES_SUCCESS,
    dailyTimeSeries: timeSeries
});

export const fetchDailyTimeSeriesFailure = errorMessage => ({
    type: types.FETCH_DAILY_TIMESERIES_FAILURE,
    error: errorMessage
});
