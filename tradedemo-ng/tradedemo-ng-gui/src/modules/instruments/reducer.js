import * as instrumentTypes from "./actionTypes";
import * as marketfeedTypes from "../marketfeed/actionTypes";

export const NAME = "instruments";

export default function reducer(state = [], action) {
    switch (action.type) {
      case instrumentTypes.FETCH_INSTRUMENTS_SUCCESS:
          return action.payload;
      case instrumentTypes.FETCH_INSTRUMENTS_FAILURE:
          return [];
      case marketfeedTypes.ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS:
          return state.filter(instrument => instrument.symbol !== action.payload.symbol);
      case marketfeedTypes.DELETE_INSTRUMENT_TO_MARKETFEED:
          return [action.instrument, ...state];
      default:
         return state;
    }
}
