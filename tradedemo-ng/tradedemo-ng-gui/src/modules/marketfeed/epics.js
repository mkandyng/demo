import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import { instrumentServiceUrl } from "../../libs/resources";
import { generateMarketfeedMovement } from "../../libs/marketfeed";
import intradayTimeSeries from "../intradayTimeSeries";
import dailyTimeSeries from "../dailyTimeSeries";
import { types,
         addInstrumentToMarketfeedSuccess,
         selectInstrumentToMarketfeed,
         addInstrumentToMarketfeedFailure } from "./actions";

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
        .ofType(types.ADD_INSTRUMENT_TO_MARKETFEED)
        .concatMap(action => fetchInstrumentQuote(action)
          .concatMap(instrument => [
              addInstrumentToMarketfeedSuccess(instrument),
              selectInstrumentToMarketfeed(instrument)
            ]
          )
          .catch(error => {addInstrumentToMarketfeedFailure(error)})
    )
}

export const selectInstrumentToMarketfeedEpic = function(action$) {
    return action$
        .ofType(types.SELECT_INSTRUMENT_TO_MARKETFEED)
        .concatMap(action => [
              intradayTimeSeries.actions.fetchIntradayTimeSeries(action.instrument.symbol),
              dailyTimeSeries.actions.fetchDailyTimeSeries(action.instrument.symbol)
            ]
        )
}
