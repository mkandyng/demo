import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import { instrumentServiceUrl } from "../../libs/resources";
import { roundValue } from "../../libs/utils";
import * as timeSeriesActions from "./timeSeriesActions";

export const fetchDailyTimeSeriesEpic = function(action$) {
    const maxDisplayRecords = 10;
    return action$
        .ofType(timeSeriesActions.types.FETCH_DAILY_TIMESERIES)
        .switchMap((action) => {
            return ajax
                .getJSON(instrumentServiceUrl + "/dailyPrices/" + action.symbol)
                .map(jsonPayload => jsonPayload.slice(0, maxDisplayRecords).reverse())
                .map(requiredTimeSeries => requiredTimeSeries.map((series) => {
                          return { name:  series.dateTime,
                                   open:  series["open"],
                                   high:  series["high"],
                                   low:   series["low"],
                                   close: series["close"]
                          };
                }));
        })
        .map(timeSeries => timeSeriesActions.fetchDailyTimeSeriesSuccess(timeSeries))
        .catch(error => {timeSeriesActions.fetchDailyTimeSeriesFailure(error.message)})
}

export const fetchIntradayTimeSeriesEpic = function(action$) {
    const maxDisplayRecords = 15;
    const sliceHourMinDateTime = date => date.substr(11,5);
    return action$
        .ofType(timeSeriesActions.types.FETCH_INTRADAY_TIMESERIES)
        .switchMap((action) => {
            return ajax
                .getJSON(instrumentServiceUrl + "/intradayPrices/" + action.symbol)
                .map(jsonPayload => jsonPayload.slice(0, maxDisplayRecords).reverse())
                 .map(requiredTimeSeries => requiredTimeSeries.map(series => {
                    return { name: sliceHourMinDateTime(series.dateTime),
                             price: roundValue((series["high"] + series["low"])/2, 100)
                    };
                }));
        })
        .map(timeSeries => timeSeriesActions.fetchIntradayTimeSeriesSuccess(timeSeries))
        .catch(error => {timeSeriesActions.fetchIntradayTimeSeriesFailure(error.message)})
}
