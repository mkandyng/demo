import { combineEpics } from "redux-observable";
import * as instrumentEpics from "../modules/instruments/epics";
import * as intradayTimeSeriesEpics from "../modules/intradayTimeSeries/epics";
import * as dailyTimeSeriesEpics from "../modules/dailyTimeSeries/epics";

export default combineEpics(
             instrumentEpics.fetchInstrumentsEpic,
             intradayTimeSeriesEpics.fetchIntradayTimeSeriesEpic,
             dailyTimeSeriesEpics.fetchDailyTimeSeriesEpic,
             instrumentEpics.addInstrumentToMarketfeedEpic,
             instrumentEpics.selectMarketfeedInstrumentEpic);
