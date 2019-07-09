import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { combineEpics } from "redux-observable";
import { Observable } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators'
import { instrumentServiceUrl } from "../../../libs/resources";
import { fetchIntradayTimeSeries,
         fetchDailyTimeSeries } from "../../timeSeries/store/timeSeriesActions";
import * as instrumentsActions from "./instrumentsActions";
import { generateMarketfeedMovement, MAX_MARKET_FEED_INSTRUMENTS } from "../instruments";

export const instrumentsEpics = combineEpics( fetchInstrumentsEpic,
                                              addInstrumentToMarketfeedEpic,
                                              selectMarketfeedInstrumentEpic )

function fetchInstrumentsEpic(action$, store, {ajax}) {
    function fetchInstruments(ajaxRestApi){
      return ajaxRestApi
          .getJSON(instrumentServiceUrl + "/instruments/")
          .map(payload => payload.map(instrument => {
              let object = {
                  symbol: instrument.symbol,
                  name: instrument.name,
                  currency: instrument.currency
              }
              return object;
          }));
    }

    return action$
        .ofType(instrumentsActions.types.FETCH_INSTRUMENTS)
        .switchMap(action =>
            fetchInstruments(ajax).pipe(
                concatMap(instruments => [
                            instrumentsActions.fetchInstrumentsSuccess(instruments),
                            ...instruments.slice(0,MAX_MARKET_FEED_INSTRUMENTS)
                                  .map(instrument => instrumentsActions.addInstrumentToMarketfeed(instrument))
                ]),
                catchError(error => Observable.of(instrumentsActions.fetchInstrumentsFailure(error)))
          )
        )
}

function addInstrumentToMarketfeedEpic(action$, store, {ajax}) {
    const fetchInstrumentQuote = action => {
      return ajax
          .getJSON(instrumentServiceUrl + "/instrumentQuote/" + action.instrument.symbol)
          .map(data => {
                  const newInstrument = { symbol:   action.instrument.symbol,
                                          name:     action.instrument.name,
                                          currency: action.instrument.currency,
                                          price:    data.price,
                                          open:     data.open };
                  return (
                     generateMarketfeedMovement(newInstrument)
                  )
          });
    }

    return action$
        .ofType(instrumentsActions.types.ADD_INSTRUMENT_TO_MARKETFEED)
        .concatMap(action => fetchInstrumentQuote(action).pipe(
            concatMap(instrument => [
                instrumentsActions.addInstrumentToMarketfeedSuccess(instrument),
                instrumentsActions.selectMarketfeedInstrument(instrument) ]
            ), catchError(error => Observable.of(instrumentsActions.addInstrumentToMarketfeedFailure(error)))
          )
    )
}

function selectMarketfeedInstrumentEpic(action$) {
    return action$
        .ofType(instrumentsActions.types.SELECT_MARKETFEED_INSTRUMENT)
        .concatMap(action => [
              fetchIntradayTimeSeries(action.instrument.symbol),
              fetchDailyTimeSeries(action.instrument.symbol)
            ]
        )
}
