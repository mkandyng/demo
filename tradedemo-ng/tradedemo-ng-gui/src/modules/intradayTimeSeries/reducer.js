import * as actions from './actions';

export const NAME = "intradayTimeSeries";

export default function intradayTimeSeriesReducer(state = {}, action) {
    switch (action.type) {
      case actions.types.FETCH_INTRADAY_TIMESERIES_SUCCESS:
          return {
              chartData: action.intradayTimeSeries,
              maxValue: Math.max.apply(Math, action.intradayTimeSeries.map(o =>  o.price)),
              minValue: Math.min.apply(Math, action.intradayTimeSeries.map(o =>  o.price))
          };
      default:
         return state;
    }
}
