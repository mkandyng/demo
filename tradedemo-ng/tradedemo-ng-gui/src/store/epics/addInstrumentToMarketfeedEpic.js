import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import { instrumentServiceUrl } from "../../libs/resources";
import { generateMarketDataMovement } from "../../libs/marketfeed";

import {
    ADD_INSTRUMENT_TO_MARKETFEED,
    addInstrumentToMarketfeedSuccess,
    addInstrumentToMarketfeedFailure
} from "../actions/addInstrumentToMarketfeed";

export const addInstrumentToMarketfeedEpic = function(action$) {
    return action$
        .ofType(ADD_INSTRUMENT_TO_MARKETFEED)
        .concatMap((action) => {
            return ajax
                .getJSON(instrumentServiceUrl + "/instrumentQuote/" + action.instrument.symbol)
                .map(data => {
                     let instrument = {
                            symbol: action.instrument.symbol,
              	            name: action.instrument.name,
              	            currency: action.instrument.currency,
              	            price: data["price"],
              	            open: data["open"]};
                     return (
                          generateMarketDataMovement(instrument)
                     )
                });
        })
      .map(instrument => {return addInstrumentToMarketfeedSuccess(instrument)})
      .catch(error => {addInstrumentToMarketfeedFailure(error.message)})
}
