import * as actions from "./actions";

export const NAME = "orderbook";

export default function reducer(state = [], action) {
    switch (action.type) {
        case actions.types.PLACE_ORDER:
            return [action.order, ...state];
        case actions.types.UPDATE_ORDER:
            const remainingOrders = state.filter(order => order.orderRef !== action.order.orderRef);
            return [action.order, ...remainingOrders];
        default:
           return state;
    }
}
