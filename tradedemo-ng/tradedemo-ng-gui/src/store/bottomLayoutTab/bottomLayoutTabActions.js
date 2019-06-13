export const BOTTOM_LAYOUT_TAB = ({
    SELECT_BOTTOM_LAYOUT_TAB : "SELECT_BOTTOM_LAYOUT_TAB"
});

export const selectBottomLayoutTab = index => ({
    type: BOTTOM_LAYOUT_TAB.SELECT_BOTTOM_LAYOUT_TAB,
    selectedBottomLayoutTab: index
});
