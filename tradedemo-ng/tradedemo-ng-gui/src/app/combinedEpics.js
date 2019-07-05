import { combineEpics } from "redux-observable";
import * as instrumentsEpics from "../modules/instruments/store/instrumentsEpics";
import * as timeSeriesEpics from "../modules/timeSeries/store/timeSeriesEpics";
import { ajax } from 'rxjs/observable/dom/ajax';

/**
 * root Epics, defining redux observable epics
 */
export const rootEpic = (...args) => combineEpics(
             instrumentsEpics.fetchInstrumentsEpic,
             instrumentsEpics.addInstrumentToMarketfeedEpic,
             instrumentsEpics.selectMarketfeedInstrumentEpic,
             timeSeriesEpics.fetchIntradayTimeSeriesEpic,
             timeSeriesEpics.fetchDailyTimeSeriesEpic)(...args, {ajax});
