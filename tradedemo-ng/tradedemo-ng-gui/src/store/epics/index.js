import { combineEpics } from "redux-observable";
import { fetchInstrumentsEpic } from "./fetchInstrumentsEpic";
import { fetchInstrumentIntradayTimeSeriesEpic } from "./fetchInstrumentIntradayTimeSeriesEpic";
import { fetchInstrumentDailyTimeSeriesEpic } from "./fetchInstrumentDailyTimeSeriesEpic";
import { addInstrumentToMarketfeedEpic } from "./addInstrumentToMarketfeedEpic";
import { selectInstrumentToMarketfeedEpic } from "./selectInstrumentToMarketfeedEpic";

export const rootEpic = combineEpics(fetchInstrumentsEpic,
             fetchInstrumentIntradayTimeSeriesEpic,
             fetchInstrumentDailyTimeSeriesEpic,
             addInstrumentToMarketfeedEpic,
             selectInstrumentToMarketfeedEpic);
