import { combineEpics } from "redux-observable";
import * as instrumentEpics from "../modules/instruments/epics";
import * as timeSeriesEpics from "../modules/timeSeries/epics";

export default combineEpics(
             instrumentEpics.fetchInstrumentsEpic,
             instrumentEpics.addInstrumentToMarketfeedEpic,
             instrumentEpics.selectMarketfeedInstrumentEpic,
             timeSeriesEpics.fetchIntradayTimeSeriesEpic,
             timeSeriesEpics.fetchDailyTimeSeriesEpic,);
