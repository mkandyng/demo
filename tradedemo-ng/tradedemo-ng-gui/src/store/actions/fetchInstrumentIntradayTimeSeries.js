export const FETCH_INSTRUMENT_INTRADAY_TIMESERIES = "FETCH_INSTRUMENT_INTRADAY_TIMESERIES";
export const FETCH_INSTRUMENT_INTRADAY_TIMESERIES_SUCCESS = "FETCH_INSTRUMENT_INTRADAY_TIMESERIES_SUCCESS";
export const FETCH_INSTRUMENT_INTRADAY_TIMESERIES_FAILURE = "FETCH_INSTRUMENT_INTRADAY_TIMESERIES_FAILURE";

export const fetchInstrumentIntradayTimeSeries = instrument => ({
    type: FETCH_INSTRUMENT_INTRADAY_TIMESERIES,
    instrument: instrument
});

export const fetchInstrumentIntradayTimeSeriesSuccess = timeSeries => ({
    type: FETCH_INSTRUMENT_INTRADAY_TIMESERIES_SUCCESS,
    intradayTimeSeries: timeSeries
});

export const fetchInstrumentIntradayTimeSeriesFailure = errorMessage => ({
    type: FETCH_INSTRUMENT_INTRADAY_TIMESERIES_FAILURE,
    error: errorMessage
});
