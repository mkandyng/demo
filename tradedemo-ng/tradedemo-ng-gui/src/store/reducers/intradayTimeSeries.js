import {
    FETCH_INSTRUMENT_INTRADAY_TIMESERIES_SUCCESS
} from "../actions/fetchInstrumentIntradayTimeSeries";

export default function intradayTimeSeries(state = {}, action) {
    switch (action.type) {
      case FETCH_INSTRUMENT_INTRADAY_TIMESERIES_SUCCESS:
          return {
              chartData: action.intradayTimeSeries,
			        maxValue: Math.max.apply(Math, action.intradayTimeSeries.map(o =>  o.price)),
			        minValue: Math.min.apply(Math, action.intradayTimeSeries.map(o =>  o.price))
          };
      default:
         return state;
    }
}
