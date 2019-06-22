// dailyTimeSeries/index.js
import * as instrumentActions from "./actions";
import * as instrumentsEpics from "./epics";
import reducer, { NAME } from "./reducer";
import * as components from "./components";

export default { instrumentActions, reducer, NAME, components, instrumentsEpics };
