import {
    FETCH_INSTRUMENT_DAILY_TIMESERIES_SUCCESS
} from "../actions/fetchInstrumentDailyTimeSeries";

export default function dailyTimeSeries(state = {}, action) {
    switch (action.type) {
      case FETCH_INSTRUMENT_DAILY_TIMESERIES_SUCCESS:
          return {
              chartData: action.dailyTimeSeries,
				      maxValue: Math.max.apply(Math, action.dailyTimeSeries.map(o => o.high)),
				      minValue: Math.min.apply(Math, action.dailyTimeSeries.map(o => o.low))
          };
      default:
         return state;
    }
}
