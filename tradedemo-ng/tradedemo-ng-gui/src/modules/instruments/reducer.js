import * as marketfeedActions from "../marketfeed/actions";
import * as instrumentActions from "../instruments/actions";

export const NAME = "instruments";

export default function reducer(state = [], action) {
    switch (action.type) {
      case instrumentActions.types.FETCH_INSTRUMENTS_SUCCESS:
          return action.payload;
      case instrumentActions.types.FETCH_INSTRUMENTS_FAILURE:
          return [];
      case marketfeedActions.types.ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS:
          return state.filter(instrument => instrument.symbol !== action.payload.symbol);
      case marketfeedActions.types.DELETE_INSTRUMENT_TO_MARKETFEED:
          return [action.instrument, ...state];
      default:
         return state;
    }
}
