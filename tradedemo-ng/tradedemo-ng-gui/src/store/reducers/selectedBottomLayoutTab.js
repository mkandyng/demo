import {
    SELECT_BOTTOM_LAYOUT_TAB
} from "../actions/selectBottomLayoutTab";

export default function selectedBottomLayout(state = 0, action) {
    switch (action.type) {
      case SELECT_BOTTOM_LAYOUT_TAB:
        return action.selectedBottomLayoutTab;
      default:
        return state;
    }
}
