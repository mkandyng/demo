import * as types from "./actionTypes";

export const addInstrumentToMarketfeed = instrument => ({
  type: types.ADD_INSTRUMENT_TO_MARKETFEED,
  instrument: instrument
});

export const addInstrumentToMarketfeedSuccess = instrument => ({
  type: types.ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS,
  payload: instrument
});

export const addInstrumentToMarketfeedFailure = message => ({
  type: types.ADD_INSTRUMENT_TO_MARKETFEED_FAILURE,
  payload: message
});

export const deleteInstrumentToMarketfeed = instrument => ({
    type: types.DELETE_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument,
    selectedMarketfeedIndex: 0
});

export const selectInstrumentToMarketfeed = instrument => ({
    type: types.SELECT_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument
});

export const updateInstrumentToMarketfeed = instrument => ({
    type: types.UPDATE_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument
});
