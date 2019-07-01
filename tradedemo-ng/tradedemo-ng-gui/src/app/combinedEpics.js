import { combineEpics } from "redux-observable";
import * as instrumentsEpics from "../modules/instruments/instrumentsEpics";
import * as timeSeriesEpics from "../modules/timeSeries/timeSeriesEpics";

/**
 * root Epics, defining redux observable epics
 */
export default combineEpics(
             instrumentsEpics.fetchInstrumentsEpic,
             instrumentsEpics.addInstrumentToMarketfeedEpic,
             instrumentsEpics.selectMarketfeedInstrumentEpic,
             timeSeriesEpics.fetchIntradayTimeSeriesEpic,
             timeSeriesEpics.fetchDailyTimeSeriesEpic);
