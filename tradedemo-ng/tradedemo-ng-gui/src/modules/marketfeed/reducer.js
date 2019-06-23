import { types } from "./actions";

export const NAME = "marketfeed";

export default function reducer(state = {instruments:[],selected:{}}, action) {
    let instruments = state.instruments;
    switch (action.type) {
      case types.ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS:
          instruments = [action.payload, ...state.instruments];
          return {
            instruments: instruments,
            selected: instruments[0]
          };
      case types.ADD_INSTRUMENT_TO_MARKETFEED_FAILURE:
         return state;
      case types.SELECT_INSTRUMENT_TO_MARKETFEED:
          return {
            ...state,
            selected: action.instrument
          };
      case types.UPDATE_INSTRUMENT_TO_MARKETFEED:
          const selected = state.selected.symbol === action.instrument.symbol?
                                  action.instrument:state.selected;
          return {
            ...state,
            instruments: instruments.map(instrument => {
                return instrument.symbol === action.instrument.symbol ?
                                             action.instrument: instrument;
            }),
            selected: selected
          };
      case types.DELETE_INSTRUMENT_TO_MARKETFEED:
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
