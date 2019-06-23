import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import { instrumentServiceUrl } from "../../libs/resources";
import * as actions from "./actions";

export const fetchDailyTimeSeriesEpic = function(action$) {
    const maxRecords = 10;
    return action$
        .ofType(actions.types.FETCH_DAILY_TIMESERIES)
        .switchMap((action) => {
            return ajax
                .getJSON(instrumentServiceUrl + "/dailyPrices/" + action.symbol)
                .map(jsonPayload => jsonPayload.slice(0, maxRecords).reverse())
                .map(requiredTimeSeries => requiredTimeSeries.map((series) => {
                          return { name:  series.dateTime,
                                   open:  series["open"],
                                   high:  series["high"],
                                   low:   series["low"],
                                   close: series["close"]
                          };
                }));
        })
        .map(timeSeries => actions.fetchDailyTimeSeriesSuccess(timeSeries))
        .catch(error => {actions.fetchDailyTimeSeriesFailure(error.message)})
}
