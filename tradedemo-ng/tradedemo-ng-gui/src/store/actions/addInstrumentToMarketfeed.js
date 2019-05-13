export const ADD_INSTRUMENT_TO_MARKETFEED = "ADD_INSTRUMENT_TO_MARKETFEED";
export const ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS = "ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS";
export const ADD_INSTRUMENT_TO_MARKETFEED_FAILURE = "ADD_INSTRUMENT_TO_MARKETFEED_FAILURE";

export const addInstrumentToMarketfeed = (instrument) => ({
    type: ADD_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument
});

export const addInstrumentToMarketfeedSuccess = (instrument) => ({
    type: ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS,
    payload: instrument
});

export const addInstrumentToMarketfeedFailure = (message) => ({
    type: ADD_INSTRUMENT_TO_MARKETFEED_FAILURE,
    payload: message
});

