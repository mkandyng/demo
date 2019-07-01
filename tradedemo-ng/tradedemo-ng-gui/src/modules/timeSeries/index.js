import * as timeSeriesActions from "./timeSeriesActions";
import * as timeSeriesEpics from "./timeSeriesEpics";
import timeSeriesReducer, { NAME } from "./timeSeriesReducer";

export default { timeSeriesActions, timeSeriesReducer, NAME,  timeSeriesEpics };
