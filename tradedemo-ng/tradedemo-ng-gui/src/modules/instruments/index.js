import * as instrumentsActions from "./instrumentsActions";
import * as instrumentsEpics from "./instrumentsEpics";
import instrumentsReducer, { NAME } from "./instrumentsReducer";

export const MAX_MARKET_FEED_INSTRUMENTS = 5;
export default { instrumentsActions, instrumentsReducer, NAME, instrumentsEpics };
