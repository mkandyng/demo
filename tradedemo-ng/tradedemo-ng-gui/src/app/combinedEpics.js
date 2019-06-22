import { combineEpics } from "redux-observable";
import * as instrumentEpics from "../modules/instruments/epics";
import * as intradayTimeSeriesEpics from "../modules/intradayTimeSeries/epics";
import * as dailyTimeSeriesEpics from "../modules/dailyTimeSeries/epics";
import * as marketfeedEpics from "../modules/marketfeed/epics";

export default combineEpics(
             instrumentEpics.fetchInstrumentsEpic,
             intradayTimeSeriesEpics.fetchIntradayTimeSeriesEpic,
             dailyTimeSeriesEpics.fetchDailyTimeSeriesEpic,
             marketfeedEpics.addInstrumentToMarketfeedEpic,
             marketfeedEpics.selectInstrumentToMarketfeedEpic);
