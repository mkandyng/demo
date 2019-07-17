import {
  combineEpics
} from "redux-observable";
import {
  instrumentsEpics
} from "../modules/instruments/store/instrumentsEpics";
import {
  timeSeriesEpics
} from "../modules/timeSeries/store/timeSeriesEpics";

/**
 * root Epics, defining redux observable epics
 */
export const rootEpic = combineEpics(
  instrumentsEpics,
  timeSeriesEpics);
