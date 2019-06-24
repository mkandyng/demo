import * as actions from './actions';

export const NAME = "timeSeries";

const transformTimeSeries = (timeSeries, maxPredicate, minPredicate) => {
  return {
      chartData: timeSeries,
      maxValue: Math.max.apply(Math, timeSeries.map(maxPredicate)),
      minValue: Math.min.apply(Math, timeSeries.map(minPredicate))
  }
}

export default function reducer(state = {dailyTimeSeries:{}, intradayTimeSeries:{}}, action) {
    switch (action.type) {
      case actions.types.FETCH_DAILY_TIMESERIES_SUCCESS:
          return {
              ...state,
              dailyTimeSeries: transformTimeSeries(action.timeSeries, o => o.high, o => o.low)
          };
      case actions.types.FETCH_INTRADAY_TIMESERIES_SUCCESS:
          return {
              ...state,
              intradayTimeSeries: transformTimeSeries(action.timeSeries, o =>  o.price, o =>  o.price)
          }
      default:
         return state;
    }
}
