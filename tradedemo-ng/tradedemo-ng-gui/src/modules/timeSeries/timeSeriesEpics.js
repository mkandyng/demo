import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { instrumentServiceUrl } from "../../libs/resources";
import { roundValue } from "../../libs/utils";
import * as timeSeriesActions from "./timeSeriesActions";

export function fetchDailyTimeSeriesEpic(action$, store, {ajax}) {
    const maxDisplayRecords = 10;
    return action$
        .ofType(timeSeriesActions.types.FETCH_DAILY_TIMESERIES)
        .concatMap(action =>
            ajax.getJSON(instrumentServiceUrl + "/dailyPrices/" + action.symbol).pipe(
                map(jsonPayload => jsonPayload.slice(0, maxDisplayRecords).reverse()),
                map(requiredTimeSeries => requiredTimeSeries.map(series =>
                          ({ name:  series.dateTime,
                             open:  series.open,
                             high:  series.high,
                             low:   series.low,
                             close: series.close
                    })
                )),
                map(timeSeries => timeSeriesActions.fetchDailyTimeSeriesSuccess(timeSeries)),
                catchError(error => Observable.of(timeSeriesActions.fetchDailyTimeSeriesFailure(error)))
            )
        )
}

export function fetchIntradayTimeSeriesEpic(action$, store, {ajax}) {
    const maxDisplayRecords = 15;
    const sliceHourMinDateTime = date => date.substr(11,5);
    return action$
        .ofType(timeSeriesActions.types.FETCH_INTRADAY_TIMESERIES)
        .concatMap(action =>
            ajax.getJSON(instrumentServiceUrl + "/intradayPrices/" + action.symbol).pipe(
                 map(jsonPayload => jsonPayload.slice(0, maxDisplayRecords).reverse()),
                 map(requiredTimeSeries => requiredTimeSeries.map(series =>
                    ({ name: sliceHourMinDateTime(series.dateTime),
                       price: roundValue((series.high + series.low)/2, 100)
                    })
                 )),
                 map(timeSeries => timeSeriesActions.fetchIntradayTimeSeriesSuccess(timeSeries)),
                 catchError(error => Observable.of(timeSeriesActions.fetchIntradayTimeSeriesFailure(error)))
            )
        )
}
