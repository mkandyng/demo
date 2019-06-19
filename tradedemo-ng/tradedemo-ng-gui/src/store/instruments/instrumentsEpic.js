import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import { instrumentServiceUrl } from "../../common//resources";
import { MAX_MARKET_FEED_INSTRUMENTS } from "../../common//marketfeed";

import {
    INSTRUMENTS,
    fetchInstrumentsSuccess,
    fetchInstrumentsFailure
} from "./instrumentsActions";

import {
    addInstrumentToMarketfeed
} from "../marketfeed/marketfeedActions";

export const fetchInstrumentsEpic = function(action$) {
    const fetchInstruments = () => {
      return ajax
          .getJSON(instrumentServiceUrl + "/instruments")
          .map(payload => payload.map((instrument) => {
              let object = {
                  symbol: instrument["symbol"],
                  name: instrument["name"],
                  currency: instrument["currency"]
              }
              return object;
          }));
    }

    return action$
        .ofType(INSTRUMENTS.FETCH_INSTRUMENTS)
        .switchMap(action =>
            fetchInstruments()
            .concatMap(instruments => [
              fetchInstrumentsSuccess(instruments),
              ...instruments.slice(0,MAX_MARKET_FEED_INSTRUMENTS)
                    .map(instrument => addInstrumentToMarketfeed(instrument))
            ])
            .catch(error => {fetchInstrumentsFailure(error.message)})
        )
}
