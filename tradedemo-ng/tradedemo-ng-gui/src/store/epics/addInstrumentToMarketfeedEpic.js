import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import { instrumentServiceUrl } from "../../common/libs/resources";

import {
         generateMarketDataMovement
} from "../../common/libs/marketfeed";

import {
    ADD_INSTRUMENT_TO_MARKETFEED,
    addInstrumentToMarketfeedSuccess,
    addInstrumentToMarketfeedFailure
} from "../actions/addInstrumentToMarketfeed";

import {
    selectInstrumentToMarketfeed
} from "../actions/selectInstrumentToMarketfeed";

export const addInstrumentToMarketfeedEpic = function(action$) {

    const fetchInstrumentQuote = action => {
      return ajax
          .getJSON(instrumentServiceUrl + "/instrumentQuote/" + action.instrument.symbol)
          .map(data => {
                  const newInstrument = { symbol:   action.instrument.symbol,
                                          name:     action.instrument.name,
                                          currency: action.instrument.currency,
                                          price:        data["price"],
                                          open:         data["open"] };
                  return (
                     generateMarketDataMovement(newInstrument)
                  )
          });
    }

    return action$
        .ofType(ADD_INSTRUMENT_TO_MARKETFEED)
        .concatMap(action => fetchInstrumentQuote(action)
          .concatMap(instrument => [
              addInstrumentToMarketfeedSuccess(instrument),
              selectInstrumentToMarketfeed(instrument)
            ]
          )
          .catch(error => {addInstrumentToMarketfeedFailure(error)})
    )
}
