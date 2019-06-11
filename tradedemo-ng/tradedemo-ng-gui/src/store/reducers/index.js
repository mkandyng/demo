import { combineReducers } from 'redux';
import instruments from './instruments';
import marketfeed from './marketfeed';
import intradayTimeSeries from './intradayTimeSeries';
import dailyTimeSeries from './dailyTimeSeries';
import orderbook from './orderbook';
import selectedBottomLayoutTab from './selectedBottomLayoutTab';

export default combineReducers({
    instruments,
    marketfeed,
    orderbook,
    intradayTimeSeries,
    dailyTimeSeries,
    selectedBottomLayoutTab
});
