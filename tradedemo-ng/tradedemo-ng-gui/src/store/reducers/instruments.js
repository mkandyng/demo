import {
    FETCH_INSTRUMENTS_FAILURE,
    FETCH_INSTRUMENTS_SUCCESS
} from "../actions/fetchInstruments";

import {
    ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS
} from "../actions/addInstrumentToMarketfeed";

import {
   DELETE_INSTRUMENT_TO_MARKETFEED
} from "../actions/deleteInstrumentToMarketfeed";

export default function instruments(state = [], action) {
    switch (action.type) {
      case FETCH_INSTRUMENTS_SUCCESS:
          return action.payload;
      case FETCH_INSTRUMENTS_FAILURE:
          return [];
      case ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS:
          return state.filter(instrument => instrument.symbol !== action.payload.symbol);
      case DELETE_INSTRUMENT_TO_MARKETFEED:
          return [action.instrument, ...state];
      default:
         return state;
    }
}
