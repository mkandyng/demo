import {
    INSTRUMENTS
} from "../instruments/instrumentsActions";

import {
    MARKETFEED
} from "../marketfeed/marketfeedActions";

export default function instrumentsReducer(state = [], action) {
    switch (action.type) {
      case INSTRUMENTS.FETCH_INSTRUMENTS_SUCCESS:
          return action.payload;
      case INSTRUMENTS.FETCH_INSTRUMENTS_FAILURE:
          return [];
      case MARKETFEED.ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS:
          return state.filter(instrument => instrument.symbol !== action.payload.symbol);
      case MARKETFEED.DELETE_INSTRUMENT_TO_MARKETFEED:
          return [action.instrument, ...state];
      default:
         return state;
    }
}
