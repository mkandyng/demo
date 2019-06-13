import {
    INSTRUMENT_INTRADAY_TIMESERIES
} from "./intradayTimeSeriesActions";

export default function intradayTimeSeriesReducer(state = {}, action) {
    switch (action.type) {
      case INSTRUMENT_INTRADAY_TIMESERIES.FETCH_INSTRUMENT_INTRADAY_TIMESERIES_SUCCESS:
          return {
              chartData: action.intradayTimeSeries,
              maxValue: Math.max.apply(Math, action.intradayTimeSeries.map(o =>  o.price)),
              minValue: Math.min.apply(Math, action.intradayTimeSeries.map(o =>  o.price))
          };
      default:
         return state;
    }
}
