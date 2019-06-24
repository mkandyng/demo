import { combineReducers } from "redux";
import instruments from "../modules/instruments";
import intradayTimeSeries from "../modules/intradayTimeSeries"
import timeSeries from "../modules/timeSeries"
import orderbook from "../modules/orderbook";
import ticket from "../modules/ticket";

export default combineReducers({
    [instruments.NAME]:instruments.reducer,
    [orderbook.NAME]:orderbook.reducer,
    [intradayTimeSeries.NAME]:intradayTimeSeries.reducer,
    [timeSeries.NAME]:timeSeries.reducer,
    [ticket.NAME]: ticket.reducer
});
