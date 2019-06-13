import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { instrumentServiceUrl } from "../../common/libs/resources";
import { ajax } from "rxjs/observable/dom/ajax";

import {
    INSTRUMENT_INTRADAY_TIMESERIES,
    fetchInstrumentIntradayTimeSeriesSuccess,
    fetchInstrumentIntradayTimeSeriesFailure,
} from "./intradayTimeSeriesActions";

export const fetchIntradayTimeSeriesEpic = function(action$) {
    const maxRecords = 15;
    return action$
        .ofType(INSTRUMENT_INTRADAY_TIMESERIES.FETCH_INSTRUMENT_INTRADAY_TIMESERIES)
        .switchMap((action) => {
            return ajax
                .getJSON(instrumentServiceUrl + "/intradayPrices/" + action.instrument.symbol)
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
        .map(timeSeries => fetchInstrumentIntradayTimeSeriesSuccess(timeSeries))
        .catch(error => {fetchInstrumentIntradayTimeSeriesFailure(error.message)})
}
