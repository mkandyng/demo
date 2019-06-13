import { combineEpics } from "redux-observable";
import { fetchInstrumentsEpic } from "./instruments/instrumentsEpic";
import { fetchIntradayTimeSeriesEpic } from "./intradayTimeSeries/intradayTimeSeriesEpic";
import { fetchDailyTimeSeriesEpic } from "./dailyTimeSeries/dailyTimeSeriesEpic";
import { addInstrumentToMarketfeedEpic,
         selectInstrumentToMarketfeedEpic } from "./marketfeed/marketfeedEpic";

export default combineEpics(
             fetchInstrumentsEpic,
             fetchIntradayTimeSeriesEpic,
             fetchDailyTimeSeriesEpic,
             addInstrumentToMarketfeedEpic,
             selectInstrumentToMarketfeedEpic);
