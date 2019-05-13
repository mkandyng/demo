export const FETCH_INSTRUMENT_DAILY_TIMESERIES = "FETCH_INSTRUMENT_DAILY_TIMESERIES";
export const FETCH_INSTRUMENT_DAILY_TIMESERIES_SUCCESS = "FETCH_INSTRUMENT_DAILY_TIMESERIES_SUCCESS";
export const FETCH_INSTRUMENT_DAILY_TIMESERIES_FAILURE = "FETCH_INSTRUMENT_DAILY_TIMESERIES_FAILURE";

export const fetchInstrumentDailyTimeSeries = instrument => ({
    type: FETCH_INSTRUMENT_DAILY_TIMESERIES,
    instrument: instrument
});

export const fetchInstrumentDailyTimeSeriesSuccess = timeSeries => ({
    type: FETCH_INSTRUMENT_DAILY_TIMESERIES_SUCCESS,
    dailyTimeSeries: timeSeries
});

export const fetchInstrumentDailyTimeSeriesFailure = errorMessage => ({
    type: FETCH_INSTRUMENT_DAILY_TIMESERIES_FAILURE,
    error: errorMessage
});

