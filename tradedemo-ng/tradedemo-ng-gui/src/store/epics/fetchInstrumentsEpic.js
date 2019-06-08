import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import {instrumentServiceUrl } from "../../libs/resources";

import {
    FETCH_INSTRUMENTS,
    fetchInstrumentsSuccess,
    fetchInstrumentsFailure
} from "../actions/fetchInstruments";

export const fetchInstrumentsEpic = function(action$) {
    return action$
        .ofType(FETCH_INSTRUMENTS)
        .switchMap((action) => {
            return ajax
                .getJSON(instrumentServiceUrl + "/instruments")
                .map(payload => payload.map((instrument) => {
                    let object = {
                         symbol: instrument["symbol"],
                         name: instrument["name"],
                         currency: instrument["currency"]
                    };
                    return object;
            }));
        })
        .map(instruments => fetchInstrumentsSuccess(instruments))
        .catch(error => {fetchInstrumentsFailure(error.message)})
}
