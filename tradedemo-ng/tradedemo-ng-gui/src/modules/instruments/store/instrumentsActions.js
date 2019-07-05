export const types = {
    FETCH_INSTRUMENTS: "instruments/FETCH_INSTRUMENTS",
    FETCH_INSTRUMENTS_SUCCESS: "instruments/FETCH_INSTRUMENTS_SUCCESS",
    FETCH_INSTRUMENTS_FAILURE: "instruments/FETCH_INSTRUMENTS_FAILURE",
    ADD_INSTRUMENT_TO_MARKETFEED: "instruments/ADD_INSTRUMENT_TO_MARKETFEED",
    ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS: "instruments/ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS",
    ADD_INSTRUMENT_TO_MARKETFEED_FAILURE: "instruments/ADD_INSTRUMENT_TO_MARKETFEED_FAILURE",
    DELETE_MARKETFEED_INSTRUMENT: "instruments/DELETE_MARKETFEED_INSTRUMENT",
    SELECT_MARKETFEED_INSTRUMENT: "instruments/SELECT_MARKETFEED_INSTRUMENT",
    UPDATE_MARKETFEED_INSTRUMENT: "instruments/UPDATE_MARKETFEED_INSTRUMENT"
}

export const fetchInstruments = ()  => ({
    type: types.FETCH_INSTRUMENTS
});

export const fetchInstrumentsSuccess = instruments => ({
    type: types.FETCH_INSTRUMENTS_SUCCESS,
    instruments: instruments
});

export const fetchInstrumentsFailure = error => ({
    type: types.FETCH_INSTRUMENTS_FAILURE,
    error: error
});

export const addInstrumentToMarketfeed = instrument => ({
    type: types.ADD_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument
});

export const addInstrumentToMarketfeedSuccess = instrument => ({
    type: types.ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS,
    instrument: instrument
});

export const addInstrumentToMarketfeedFailure = error => ({
    type: types.ADD_INSTRUMENT_TO_MARKETFEED_FAILURE,
    error: error
});

export const selectMarketfeedInstrument = instrument => ({
    type: types.SELECT_MARKETFEED_INSTRUMENT,
    instrument: instrument
});

export const updateMarketfeedInstrument = instrument => ({
    type: types.UPDATE_MARKETFEED_INSTRUMENT,
    instrument: instrument
});

export const deleteMarketfeedInstrument = instrument => ({
    type: types.DELETE_MARKETFEED_INSTRUMENT,
    instrument: instrument
});
