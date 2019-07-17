import * as instrumentsActions from "./instrumentsActions";
import {
  retrieveInstrument,
  removeInstrument,
  updateInstrument
} from "../instruments";

export const NAME = "instruments";

export function instrumentsReducer(state = {
  searchInstruments: [],
  marketfeedInstruments: [],
  selected: {symbol: ""}
}, action = {}) {
  switch (action.type) {
    case instrumentsActions.types.FETCH_INSTRUMENTS_SUCCESS:
      return {
        searchInstruments: action.instruments,
          marketfeedInstruments: [],
          selected: {}
      };

    case instrumentsActions.types.FETCH_INSTRUMENTS_FAILURE:
      console.log(action.error);
      return state;

    case instrumentsActions.types.ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS:
      return {
        searchInstruments: removeInstrument(state.searchInstruments,
            action.instrument.symbol),
          marketfeedInstruments: [action.instrument,
            ...state.marketfeedInstruments
          ],
          selected: action.instrument
      };

    case instrumentsActions.types.ADD_INSTRUMENT_TO_MARKETFEED_FAILURE:
      console.log(action.error);
      return state;

    case instrumentsActions.types.SELECT_MARKETFEED_INSTRUMENT:
      return {
        ...state,
        selected: retrieveInstrument(state.marketfeedInstruments,
          action.instrument.symbol)
      };

    case instrumentsActions.types.UPDATE_MARKETFEED_INSTRUMENT:
      const selected = state.selected.symbol === action.instrument.symbol ?
        action.instrument : state.selected;
      return {
        ...state,
        marketfeedInstruments: updateInstrument(state.marketfeedInstruments,
            action.instrument),
          selected: selected
      };

    case instrumentsActions.types.DELETE_MARKETFEED_INSTRUMENT:
      const marketfeedInstruments = removeInstrument(state.marketfeedInstruments,
        action.instrument.symbol);
      return {
        searchInstruments: [action.instrument, ...state.searchInstruments],
          marketfeedInstruments: marketfeedInstruments,
          selected: marketfeedInstruments.length === 0 ? {} : marketfeedInstruments[0]
      };

    default:
      return state;
  }
}
