import * as timeSeriesActions from './timeSeriesActions';
import { transformTimeSeries } from "../../../libs/utils"

export const NAME = "timeSeries";

export function timeSeriesReducer(state = {symbol: undefined, dailyTimeSeries:{}, intradayTimeSeries:{}}, action) {
    switch (action.type) {
      case timeSeriesActions.types.FETCH_DAILY_TIMESERIES_SUCCESS:
          return {
              ...state,
              symbol: action.symbol,
              dailyTimeSeries: transformTimeSeries(action.timeSeries, o => o.high, o => o.low)
          };
      case timeSeriesActions.types.FETCH_DAILY_TIMESERIES_FAILURE:
          console.log(action.error);
          return state;
      case timeSeriesActions.types.FETCH_INTRADAY_TIMESERIES_SUCCESS:
          return {
              ...state,
              symbol: action.symbol,
              intradayTimeSeries: transformTimeSeries(action.timeSeries, o =>  o.price, o =>  o.price)
          }
      case timeSeriesActions.types.FETCH_INTRADAY_TIMESERIES_FAILURE:
          console.log(action.error);
          return state;
      default:
          return state;
    }
}
