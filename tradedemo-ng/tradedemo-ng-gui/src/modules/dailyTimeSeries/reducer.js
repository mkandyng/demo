import * as types from './actionTypes';

export const NAME = "dailyTimeSeries";

export default function reducer(state = {}, action) {
    switch (action.type) {
      case types.FETCH_DAILY_TIMESERIES_SUCCESS:
          return {
              chartData: action.dailyTimeSeries,
              maxValue: Math.max.apply(Math, action.dailyTimeSeries.map(o => o.high)),
              minValue: Math.min.apply(Math, action.dailyTimeSeries.map(o => o.low))
          };
      default:
         return state;
    }
}
