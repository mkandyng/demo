import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import { instrumentServiceUrl } from "../../common//resources";

import {
         generateMarketfeedMovement
} from "../../common//marketfeed";

import {
    MARKETFEED,
    addInstrumentToMarketfeedSuccess,
    addInstrumentToMarketfeedFailure
} from "./marketfeedActions";

export const addInstrumentToMarketfeedEpic = function(action$) {
    const fetchInstrumentQuote = action => {
      return ajax
          .getJSON(instrumentServiceUrl + "/instrumentQuote/" + action.instrument.symbol)
          .map(data => {
                  const newInstrument = { symbol:   action.instrument.symbol,
                                          name:     action.instrument.name,
                                          currency: action.instrument.currency,
                                          price:    data["price"],
                                          open:     data["open"] };
                  return (
                     generateMarketfeedMovement(newInstrument)
                  )
          });
    }

    return action$
        .ofType(MARKETFEED.ADD_INSTRUMENT_TO_MARKETFEED)
        .concatMap(action => fetchInstrumentQuote(action)
          .concatMap(instrument => [
              addInstrumentToMarketfeedSuccess(instrument),
            ]
          )
          .catch(error => {addInstrumentToMarketfeedFailure(error)})
    )
}
