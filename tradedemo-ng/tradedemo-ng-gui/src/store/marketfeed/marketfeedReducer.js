import {
    MARKETFEED
} from "./marketfeedActions";

export default function marketfeed(state = {instruments:[],selected:{}}, action) {
    let instruments = state.instruments;
    switch (action.type) {
      case MARKETFEED.ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS:
          instruments = [action.payload, ...state.instruments];
          return {
            instruments: instruments,
            selected: instruments[0]
          };
      case MARKETFEED.ADD_INSTRUMENT_TO_MARKETFEED_FAILURE:
         return state;
      case MARKETFEED.SELECT_INSTRUMENT_TO_MARKETFEED:
          return {
            ...state,
            selected: action.instrument
          };
      case MARKETFEED.UPDATE_INSTRUMENT_TO_MARKETFEED:
          return {
            ...state,
            instruments: instruments.map(instrument => {
                return instrument.symbol === action.instrument.symbol ?
                                             action.instrument: instrument;
            })
          };
      case MARKETFEED.DELETE_INSTRUMENT_TO_MARKETFEED:
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
