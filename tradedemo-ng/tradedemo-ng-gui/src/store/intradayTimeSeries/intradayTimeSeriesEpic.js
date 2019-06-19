import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { instrumentServiceUrl } from "../../common//resources";
import { ajax } from "rxjs/observable/dom/ajax";

import {
    INTRADAY_TIMESERIES,
    fetchIntradayTimeSeriesSuccess,
    fetchIntradayTimeSeriesFailure,
} from "./intradayTimeSeriesActions";

export const fetchIntradayTimeSeriesEpic = function(action$) {
    const maxRecords = 15;
    return action$
        .ofType(INTRADAY_TIMESERIES.FETCH_INTRADAY_TIMESERIES)
        .switchMap((action) => {
            return ajax
                .getJSON(instrumentServiceUrl + "/intradayPrices/" + action.symbol)
                .map(jsonPayload => jsonPayload.slice(0, maxRecords).reverse())
                 .map(requiredTimeSeries => requiredTimeSeries.map(series => {
                    let high = series["high"];
                    let low = series["low"];
                    let price  = Math.round(((high + low)/2)*100)/100;
                    let hourMin = series.dateTime.substr(11,5);
                    return { name: hourMin,
                             price: price
                    };
                }));
        })
        .map(timeSeries => fetchIntradayTimeSeriesSuccess(timeSeries))
        .catch(error => {fetchIntradayTimeSeriesFailure(error.message)})
}
