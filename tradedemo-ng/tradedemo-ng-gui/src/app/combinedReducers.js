import { combineReducers } from "redux";
import * as instruments from "../modules/instruments/store/instrumentsReducer";
import * as timeSeries from "../modules/timeSeries/store/timeSeriesReducer"
import * as orderbook from "../modules/orderbook/store/orderbookReducer";
import * as ticket from "../modules/ticket/store/ticketReducer";

/**
 * root reducer
 */
export default combineReducers({
    [instruments.NAME]:instruments.instrumentsReducer,
    [orderbook.NAME]:orderbook.orderbookReducer,
    [timeSeries.NAME]:timeSeries.timeSeriesReducer,
    [ticket.NAME]: ticket.ticketReducer
});
