import { combineReducers } from "redux";
import instruments from "../modules/instruments";
import timeSeries from "../modules/timeSeries"
import orderbook from "../modules/orderbook";
import ticket from "../modules/ticket";

/**
 * root reducer
 */
export default combineReducers({
    [instruments.NAME]:instruments.reducer,
    [orderbook.NAME]:orderbook.reducer,
    [timeSeries.NAME]:timeSeries.reducer,
    [ticket.NAME]: ticket.reducer
});
