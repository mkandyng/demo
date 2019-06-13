export const MARKETFEED = ({
    ADD_INSTRUMENT_TO_MARKETFEED: "ADD_INSTRUMENT_TO_MARKETFEED",
    ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS: "ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS",
    ADD_INSTRUMENT_TO_MARKETFEED_FAILURE: "ADD_INSTRUMENT_TO_MARKETFEED_FAILURE",
    DELETE_INSTRUMENT_TO_MARKETFEED: "DELETE_INSTRUMENT_TO_MARKETFEED",
    SELECT_INSTRUMENT_TO_MARKETFEED: "SELECT_INSTRUMENT_TO_MARKETFEED",
    UPDATE_INSTRUMENT_TO_MARKETFEED: "UPDATE_INSTRUMENT_TO_MARKETFEED"
});

export const addInstrumentToMarketfeed = instrument => ({
  type: MARKETFEED.ADD_INSTRUMENT_TO_MARKETFEED,
  instrument: instrument
});

export const addInstrumentToMarketfeedSuccess = instrument => ({
  type: MARKETFEED.ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS,
  payload: instrument
});

export const addInstrumentToMarketfeedFailure = message => ({
  type: MARKETFEED.ADD_INSTRUMENT_TO_MARKETFEED_FAILURE,
  payload: message
});

export const deleteInstrumentToMarketfeed = instrument => ({
    type: MARKETFEED.DELETE_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument,
    selectedMarketfeedIndex: 0
});

export const selectInstrumentToMarketfeed = instrument => ({
    type: MARKETFEED.SELECT_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument
});

export const updateInstrumentToMarketfeed = instrument => ({
    type: MARKETFEED.UPDATE_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument
});
