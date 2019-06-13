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
    MARKETFEED,
    addInstrumentToMarketfeedSuccess,
    addInstrumentToMarketfeedFailure,
    selectInstrumentToMarketfeed
} from "./marketfeedActions";

import {
  fetchInstrumentIntradayTimeSeries
} from "../../store/intradayTimeSeries/intradayTimeSeriesActions";

import {
  fetchInstrumentDailyTimeSeries
} from "../../store/dailyTimeSeries/dailyTimeSeriesActions";

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
                     generateMarketDataMovement(newInstrument)
                  )
          });
    }
    
    return action$
        .ofType(MARKETFEED.ADD_INSTRUMENT_TO_MARKETFEED)
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
        .ofType(MARKETFEED.SELECT_INSTRUMENT_TO_MARKETFEED)
        .concatMap(action => [
              fetchInstrumentIntradayTimeSeries(action.instrument),
              fetchInstrumentDailyTimeSeries(action.instrument)
            ]
        )
}
