// dailyTimeSeries/index.js
import * as actions from "./actions";
import * as epics from "./epics";
import reducer, { NAME } from "./reducer";

export const MAX_MARKET_FEED_INSTRUMENTS = 5;
export default { actions, reducer, NAME, epics };
