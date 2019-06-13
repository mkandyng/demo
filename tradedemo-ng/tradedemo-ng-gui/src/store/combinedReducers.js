import { combineReducers } from 'redux';
import instruments from './instruments/instrumentsReducer';
import marketfeed from './marketfeed/marketfeedReducer';
import intradayTimeSeries from './intradayTimeSeries/intradayTimeSeriesReducer';
import dailyTimeSeries from './dailyTimeSeries/dailyTimeSeriesReducer';
import orderbook from './orderbook/orderbookReducer';
import bottomLayoutTabReducer from './bottomLayoutTab/bottomLayoutTabReducer';

export default combineReducers({
    instruments,
    marketfeed,
    orderbook,
    intradayTimeSeries,
    dailyTimeSeries,
    bottomLayoutTabReducer
});
