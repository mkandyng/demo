import * as instrumentActions from "./instrumentsActions";

export const NAME = "instruments";

const removeInstrument = (instruments, symbol) => instruments.filter(e => e.symbol !== symbol);
const updateInstrument = (instruments, updateInstrument) =>
                          instruments.map(e => e.symbol === updateInstrument.symbol ? updateInstrument: e);

export default function instrumentsReducer(state = { instruments:[],
                                                     marketfeedInstruments:[],
                                                     selected:{} }, action) {

    switch (action.type) {
        case instrumentActions.types.FETCH_INSTRUMENTS_SUCCESS:
            return { instruments: action.payload,
                     marketfeedInstruments:[],
                     selected:{} }
        case instrumentActions.types.FETCH_INSTRUMENTS_FAILURE:
            return state;
        case instrumentActions.types.ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS:
            return { instruments: removeInstrument(state.instruments, action.instrument.symbol),
                     marketfeedInstruments:[action.instrument, ...state.marketfeedInstruments],
                     selected: action.instrument };
        case instrumentActions.types.ADD_INSTRUMENT_TO_MARKETFEED_FAILURE:
            return state;
        case instrumentActions.types.SELECT_MARKETFEED_INSTRUMENT:
            return { ...state,
                     selected: action.instrument };
        case instrumentActions.types.UPDATE_MARKETFEED_INSTRUMENT:
            const selected = state.selected.symbol === action.instrument.symbol?action.instrument:state.selected;
            return { ...state,
                     marketfeedInstruments: updateInstrument(state.marketfeedInstruments, action.instrument),
                     selected: selected };
        case instrumentActions.types.DELETE_MARKETFEED_INSTRUMENT:
            const  marketfeedInstruments = removeInstrument(state.marketfeedInstruments, action.instrument.symbol);
            return { instruments: [action.instrument, ...state.instruments],
                     marketfeedInstruments:marketfeedInstruments,
                     selected: marketfeedInstruments.length === 0 ? {} : marketfeedInstruments[0] };
        default:
           return state;
    }
}
