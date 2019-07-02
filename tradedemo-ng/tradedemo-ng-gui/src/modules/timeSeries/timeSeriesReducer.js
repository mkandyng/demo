import * as timeSeriesActions from './timeSeriesActions';

export const NAME = "timeSeries";

export default function timeSeriesReducer(state = {dailyTimeSeries:{}, intradayTimeSeries:{}}, action) {
    switch (action.type) {
      case timeSeriesActions.types.FETCH_DAILY_TIMESERIES_SUCCESS:
          return {
              ...state,
              dailyTimeSeries: transformTimeSeries(action.timeSeries, o => o.high, o => o.low)
          };
      case timeSeriesActions.types.FETCH_DAILY_TIMESERIES_FAILURE:
              return state;
      case timeSeriesActions.types.FETCH_INTRADAY_TIMESERIES_SUCCESS:
          return {
              ...state,
              intradayTimeSeries: transformTimeSeries(action.timeSeries, o =>  o.price, o =>  o.price)
          }
      case timeSeriesActions.types.FETCH_INTRADAY_TIMESERIES_FAILURE:
              return state;
      default:
         return state;
    }
}

const transformTimeSeries = (timeSeries, maxPredicate, minPredicate) => {
  return {
      chartData: timeSeries,
      maxValue: Math.max.apply(Math, timeSeries.map(maxPredicate)),
      minValue: Math.min.apply(Math, timeSeries.map(minPredicate))
  }
}
