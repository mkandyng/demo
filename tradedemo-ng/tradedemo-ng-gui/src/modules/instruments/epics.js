import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import { instrumentServiceUrl } from "../../libs/resources";
import timeSeries from "../timeSeries";
import { MAX_MARKET_FEED_INSTRUMENTS, generateMarketfeedMovement } from "./marketfeed";
import * as actions from "./actions";

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
        .ofType(actions.types.FETCH_INSTRUMENTS)
        .switchMap(action =>
            fetchInstruments()
            .concatMap(instruments => [
              actions.fetchInstrumentsSuccess(instruments),
              ...instruments.slice(0,MAX_MARKET_FEED_INSTRUMENTS)
                    .map(instrument => actions.addInstrumentToMarketfeed(instrument))
            ])
            .catch(error => {actions.fetchInstrumentsFailure(error.message)})
        )
}

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
        .ofType(actions.types.ADD_INSTRUMENT_TO_MARKETFEED)
        .concatMap(action => fetchInstrumentQuote(action)
          .concatMap(instrument => [
              actions.addInstrumentToMarketfeedSuccess(instrument),
              actions.selectMarketfeedInstrument(instrument)
            ]
          )
          .catch(error => {actions.addInstrumentToMarketfeedFailure(error)})
    )
}

export const selectMarketfeedInstrumentEpic = function(action$) {
    return action$
        .ofType(actions.types.SELECT_MARKETFEED_INSTRUMENT)
        .concatMap(action => [
              timeSeries.actions.fetchIntradayTimeSeries(action.instrument.symbol),
              timeSeries.actions.fetchDailyTimeSeries(action.instrument.symbol)
            ]
        )
}
