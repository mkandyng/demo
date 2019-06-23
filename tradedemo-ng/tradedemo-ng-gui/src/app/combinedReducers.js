import { combineReducers } from "redux";
import instruments from "../modules/instruments";
import intradayTimeSeries from "../modules/intradayTimeSeries"
import dailyTimeSeries from "../modules/dailyTimeSeries"
import orderbook from "../modules/orderbook";
import ticket from "../modules/ticket";

export default combineReducers({
    [instruments.NAME]:instruments.reducer,
    [orderbook.NAME]:orderbook.reducer,
    [intradayTimeSeries.NAME]:intradayTimeSeries.reducer,
    [dailyTimeSeries.NAME]:dailyTimeSeries.reducer,
    [ticket.NAME]: ticket.reducer
});
