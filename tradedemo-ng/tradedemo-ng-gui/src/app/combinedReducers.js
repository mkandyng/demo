import { combineReducers } from 'redux';
import instruments from '../modules/instruments';
import marketfeed from '../modules/marketfeed';
import intradayTimeSeries from "../modules/intradayTimeSeries"
import dailyTimeSeries from "../modules/dailyTimeSeries"
import orderbook from '../modules/orderbook';

export default combineReducers({
    [instruments.NAME]:instruments.reducer,
    [marketfeed.NAME]: marketfeed.reducer,
    [orderbook.NAME]:orderbook.reducer,
    [intradayTimeSeries.NAME]:intradayTimeSeries.reducer,
    [dailyTimeSeries.NAME]:dailyTimeSeries.reducer
});
