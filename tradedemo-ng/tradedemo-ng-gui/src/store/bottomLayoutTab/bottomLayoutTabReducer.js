import {
    BOTTOM_LAYOUT_TAB
} from "./bottomLayoutTabActions";

export default function selectedBottomLayoutReducer(state = 0, action) {
    switch (action.type) {
      case BOTTOM_LAYOUT_TAB.SELECT_BOTTOM_LAYOUT_TAB:
        return action.selectedBottomLayoutTab;
      default:
        return state;
    }
}
