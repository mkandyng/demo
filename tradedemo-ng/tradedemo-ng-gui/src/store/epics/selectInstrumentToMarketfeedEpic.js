import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import {instrumentServiceUrl } from "../../common/libs/resources";

import {
    SELECT_INSTRUMENT_TO_MARKETFEED
} from "../actions/selectInstrumentToMarketfeed";

import {
  fetchInstrumentIntradayTimeSeries
} from "../../store/actions/fetchInstrumentIntradayTimeSeries";

import {
  fetchInstrumentDailyTimeSeries
} from "../../store/actions/fetchInstrumentDailyTimeSeries";

export const selectInstrumentToMarketfeedEpic = function(action$) {
    return action$
        .ofType(SELECT_INSTRUMENT_TO_MARKETFEED)
        .concatMap(action => [
              fetchInstrumentIntradayTimeSeries(action.instrument),
              fetchInstrumentDailyTimeSeries(action.instrument)
            ]
        )
}
