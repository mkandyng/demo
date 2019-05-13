import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import { instrumentServiceUrl } from "../../libs/resources";

import {
    FETCH_INSTRUMENT_DAILY_TIMESERIES,
    fetchInstrumentDailyTimeSeriesSuccess,
    fetchInstrumentDailyTimeSeriesFailure,
} from "../actions/fetchInstrumentDailyTimeSeries";

export const fetchInstrumentDailyTimeSeriesEpic = function(action$) {
    const maxRecords = 10;
    return action$
        .ofType(FETCH_INSTRUMENT_DAILY_TIMESERIES)
        .switchMap((action) => {
            return ajax
                .getJSON(instrumentServiceUrl + "/dailyPrices/" + action.instrument.symbol)
		.map(jsonPayload => jsonPayload.slice(0, maxRecords).reverse())
		.map(requiredTimeSeries => requiredTimeSeries.map((series) => {
                                 return { name: series.dateTime,
                                          open: series["1. open"],
					  high: series["2. high"],
					  low: series["3. low"],
                                          close: series["4. close"]
                                        }
                }))
        })
        .map(timeSeries => fetchInstrumentDailyTimeSeriesSuccess(timeSeries))
        .catch(error => {fetchInstrumentDailyTimeSeriesFailure(error.message)})
}
