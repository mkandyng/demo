// dailyTimeSeries/index.js
import * as actions from "./actions";
import * as epics from "./epics";
import reducer, { NAME } from "./reducer";
import * as components from "./components";

export default { actions, reducer, NAME,  components, epics };
