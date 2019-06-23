// dailyTimeSeries/index.js
import * as actions from "./actions";
import * as instrumentsEpics from "./epics";
import reducer, { NAME } from "./reducer";

export default { actions, reducer, NAME, instrumentsEpics };
