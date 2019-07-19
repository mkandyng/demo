import {combineReducers} from "redux";
import * as instruments from "../modules/instruments/store/instrumentsReducer";
import * as timeSeries from "../modules/timeSeries/store/timeSeriesReducer"
import * as orderbook from "../modules/orders/store/ordersReducer";

/**
 * root reducer
 */
export const rootReducer = combineReducers({
  [instruments.NAME]: instruments.instrumentsReducer,
  [orderbook.NAME]: orderbook.ordersReducer,
  [timeSeries.NAME]: timeSeries.timeSeriesReducer
});
