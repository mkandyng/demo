import { initialState } from "./initialState";

import {
    FETCH_INSTRUMENTS,
    FETCH_INSTRUMENTS_FAILURE,
    FETCH_INSTRUMENTS_SUCCESS
} from "../actions/fetchInstruments";

import {
    ADD_INSTRUMENT_TO_MARKETFEED,
    ADD_INSTRUMENT_TO_MARKETFEED_FAILURE,
    ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS
} from "../actions/addInstrumentToMarketfeed";

import {
    FETCH_INSTRUMENT_INTRADAY_TIMESERIES,
    FETCH_INSTRUMENT_INTRADAY_TIMESERIES_SUCCESS,
    FETCH_INSTRUMENT_INTRADAY_TIMESERIES_FAILURE,

} from "../actions/fetchInstrumentIntradayTimeSeries";

import {
    FETCH_INSTRUMENT_DAILY_TIMESERIES,
    FETCH_INSTRUMENT_DAILY_TIMESERIES_SUCCESS,
    FETCH_INSTRUMENT_DAILY_TIMESERIES_FAILURE,

} from "../actions/fetchInstrumentDailyTimeSeries";

import {
   UPDATE_INSTRUMENT_TO_MARKETFEED
} from "../actions/updateInstrumentToMarketfeed";

import {
   DELETE_INSTRUMENT_TO_MARKETFEED
} from "../actions/deleteInstrumentToMarketfeed";

import {
   SELECT_INSTRUMENT_TO_MARKETFEED
} from "../actions/selectInstrumentToMarketfeed";

import {
    SELECT_BOTTOM_LAYOUT_TAB
} from "../actions/selectBottomLayoutTab";

import {
    PLACE_ORDER
} from "../actions/placeOrder";

import {
   UPDATE_ORDER 
} from "../actions/updateOrder";

export const rootReducer = function(state = initialState, action) {
    switch (action.type) {
        case FETCH_INSTRUMENTS:
            return {
                ...state,
		isLoading: false,
                error: null
            };
        case FETCH_INSTRUMENTS_SUCCESS:
            return {
		...state,
                instruments: [...action.payload],
		isLoading: true,
                error: null
            };
        case FETCH_INSTRUMENTS_FAILURE:
            return {
		...state,
                instruments: [],
                isLoading: false,
                error: action.payload
            };
        case ADD_INSTRUMENT_TO_MARKETFEED:
	   return {
		...state,
                isLoading: true,
                error: null
	   }
	case ADD_INSTRUMENT_TO_MARKETFEED_SUCCESS:
            return {...state,
		    instruments: state.instruments.filter(
		    				inst => inst.symbol !== action.payload.symbol),
    		    marketfeedInstruments: [action.payload,...state.marketfeedInstruments],
		    selectedMarketfeedIndex: 0,
                    isLoading: false,
               	    error: null
	    };	  
        case ADD_INSTRUMENT_TO_MARKETFEED_FAILURE:
            return {
		...state,
                isLoading: false,
                error: action.payload
            };
        case FETCH_INSTRUMENT_INTRADAY_TIMESERIES:
	   return {
		...state,
                isLoading: true,
                error: null
	   }
	case FETCH_INSTRUMENT_INTRADAY_TIMESERIES_SUCCESS:
	   return {
	   	...state,
		intradayTimeSeries: {chartData: action.intradayTimeSeries,
				     maxValue: Math.max.apply(Math, action.intradayTimeSeries.map(o =>  o.price)),
				     minValue: Math.min.apply(Math, action.intradayTimeSeries.map(o =>  o.price))},
                isLoading: false,
                error: null
	   }	  
        case FETCH_INSTRUMENT_INTRADAY_TIMESERIES_FAILURE:
            return {
		...state,
                isLoading: false,
                error: action.error
            };
        case FETCH_INSTRUMENT_DAILY_TIMESERIES:
	   return {
		...state,
                isLoading: true,
                error: null
	   }
	case FETCH_INSTRUMENT_DAILY_TIMESERIES_SUCCESS:
	   return {
	   	...state,
		dailyTimeSeries: {chartData: action.dailyTimeSeries,
				  maxValue: Math.max.apply(Math, action.dailyTimeSeries.map(o => o.high)),
				  minValue: Math.min.apply(Math, action.dailyTimeSeries.map(o => o.low))},
                isLoading: false,
                error: null
	   }	  
        case FETCH_INSTRUMENT_DAILY_TIMESERIES_FAILURE:
            return {
		...state,
                isLoading: false,
                error: action.error
            };
	case UPDATE_INSTRUMENT_TO_MARKETFEED:
	    return {
		...state,
		marketfeedInstruments: state.marketfeedInstruments.map(instrument => { 
						return instrument.symbol === action.instrument.symbol ? 
									     action.instrument: instrument; 
				       })
	    };
	case DELETE_INSTRUMENT_TO_MARKETFEED:
	    return {
		...state,
		instruments: [action.instrument, ...state.instruments],
		marketfeedInstruments: state.marketfeedInstruments.filter(instrument => { 
						return instrument.symbol !== action.instrument.symbol; 
				       }),
		selectedMarketfeedIndex: 0
	    };
	case SELECT_INSTRUMENT_TO_MARKETFEED:
	    return {
		...state,
		selectedMarketfeedIndex: action.selectedMarketfeedIndex
	    };
	case SELECT_BOTTOM_LAYOUT_TAB:
	    return {
		...state,
		selectedBottomLayoutTab: action.selectedBottomLayoutTab
	    };
	case PLACE_ORDER:
            return {
		...state,
    		orderbook: [action.order,...state.orderbook]
	    };	  
	case UPDATE_ORDER:
	    const remainingOrders = state.orderbook.filter(order => order.orderRef !== action.order.orderRef);
            return {
		...state,
 		orderbook: [action.order, ...remainingOrders]
		};
        default:
            return state;
    }
}
