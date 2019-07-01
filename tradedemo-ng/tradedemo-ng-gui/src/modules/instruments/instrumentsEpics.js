import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { ajax } from "rxjs/observable/dom/ajax";
import { instrumentServiceUrl } from "../../libs/resources";
import { MAX_MARKET_FEED_INSTRUMENTS } from "./index"
import * as instrumentsActions from "./instrumentsActions";
import timeSeries from "../timeSeries";
import generateMarketfeedMovement from "./generateMarketfeedMovement";

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
        .ofType(instrumentsActions.types.FETCH_INSTRUMENTS)
        .switchMap(action =>
            fetchInstruments()
            .concatMap(instruments => [
              instrumentsActions.fetchInstrumentsSuccess(instruments),
              ...instruments.slice(0,MAX_MARKET_FEED_INSTRUMENTS)
                    .map(instrument => instrumentsActions.addInstrumentToMarketfeed(instrument))
            ])
            .catch(error => {instrumentsActions.fetchInstrumentsFailure(error.message)})
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
        .ofType(instrumentsActions.types.ADD_INSTRUMENT_TO_MARKETFEED)
        .concatMap(action => fetchInstrumentQuote(action)
          .concatMap(instrument => [
              instrumentsActions.addInstrumentToMarketfeedSuccess(instrument),
              instrumentsActions.selectMarketfeedInstrument(instrument)
            ]
          )
          .catch(error => {instrumentsActions.addInstrumentToMarketfeedFailure(error)})
    )
}

export const selectMarketfeedInstrumentEpic = function(action$) {
    return action$
        .ofType(instrumentsActions.types.SELECT_MARKETFEED_INSTRUMENT)
        .concatMap(action => [
              timeSeries.timeSeriesActions.fetchIntradayTimeSeries(action.instrument.symbol),
              timeSeries.timeSeriesActions.fetchDailyTimeSeries(action.instrument.symbol)
            ]
        )
}
