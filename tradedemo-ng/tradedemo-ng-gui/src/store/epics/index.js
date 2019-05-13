import { combineEpics } from "redux-observable";
import { fetchInstrumentsEpic } from "./fetchInstrumentsEpic";
import { fetchInstrumentIntradayTimeSeriesEpic } from "./fetchInstrumentIntradayTimeSeriesEpic";
import { fetchInstrumentDailyTimeSeriesEpic } from "./fetchInstrumentDailyTimeSeriesEpic";
import { addInstrumentToMarketfeedEpic } from "./addInstrumentToMarketfeedEpic";
  
export const rootEpic = combineEpics(fetchInstrumentsEpic, 
				     fetchInstrumentIntradayTimeSeriesEpic,
				     fetchInstrumentDailyTimeSeriesEpic,
				     addInstrumentToMarketfeedEpic
			            );
