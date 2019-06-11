import {
    ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS,
    ADD_INSTRUMENT_TO_MARKETFEED_FAILURE
} from "../actions/addInstrumentToMarketfeed";

import {
    SELECT_INSTRUMENT_TO_MARKETFEED
} from "../actions/selectInstrumentToMarketfeed";

import {
    UPDATE_INSTRUMENT_TO_MARKETFEED
} from "../actions/updateInstrumentToMarketfeed";

import {
    DELETE_INSTRUMENT_TO_MARKETFEED
} from "../actions/deleteInstrumentToMarketfeed";

export default function marketfeed(state = {instruments:[],selected:{}}, action) {
    let instruments = state.instruments;
    switch (action.type) {
      case ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS:
          instruments = [action.payload, ...state.instruments];
          return {
            instruments: instruments,
            selected: instruments[0]
          };
      case ADD_INSTRUMENT_TO_MARKETFEED_FAILURE:
         alert(action.payload);
         return state;
      case SELECT_INSTRUMENT_TO_MARKETFEED:
          return {
            ...state,
            selected: action.instrument
          };
      case UPDATE_INSTRUMENT_TO_MARKETFEED:
          return {
            ...state,
            instruments: instruments.map(instrument => {
                return instrument.symbol === action.instrument.symbol ?
                                             action.instrument: instrument;
            })
          };
      case DELETE_INSTRUMENT_TO_MARKETFEED:
          instruments = instruments.filter(
                          instrument => instrument.symbol !== action.instrument.symbol
                        );
          return {
            instruments: instruments,
            selected: instruments[0]
          };
      default:
         return state;
    }
}
