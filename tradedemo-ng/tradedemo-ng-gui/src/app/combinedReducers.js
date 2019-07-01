import { combineReducers } from "redux";
import instruments from "../modules/instruments";
import timeSeries from "../modules/timeSeries"
import orderbook from "../modules/orderbook";
import ticket from "../modules/ticket";

/**
 * root reducer
 */
export default combineReducers({
    [instruments.NAME]:instruments.instrumentsReducer,
    [orderbook.NAME]:orderbook.orderbookReducer,
    [timeSeries.NAME]:timeSeries.timeSeriesReducer,
    [ticket.NAME]: ticket.ticketReducer
});
