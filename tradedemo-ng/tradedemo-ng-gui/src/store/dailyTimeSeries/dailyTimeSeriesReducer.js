import {
    INSTRUMENT_DAILY_TIMESERIES
} from "./dailyTimeSeriesActions";

export default function dailyTimeSeriesReducer(state = {}, action) {
    switch (action.type) {
      case INSTRUMENT_DAILY_TIMESERIES.FETCH_INSTRUMENT_DAILY_TIMESERIES_SUCCESS:
          return {
              chartData: action.dailyTimeSeries,
              maxValue: Math.max.apply(Math, action.dailyTimeSeries.map(o => o.high)),
              minValue: Math.min.apply(Math, action.dailyTimeSeries.map(o => o.low))
          };
      default:
         return state;
    }
}
