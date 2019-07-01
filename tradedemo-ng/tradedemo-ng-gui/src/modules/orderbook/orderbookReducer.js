import * as orderbookActions from "./orderbookActions";

export const NAME = "orderbook";

export default function orderbookReducer(state = [], action) {
    switch (action.type) {
        case orderbookActions.types.PLACE_ORDER:
            return [action.order, ...state];
        case orderbookActions.types.UPDATE_ORDER:
            const remainingOrders = state.filter(order => order.orderRef !== action.order.orderRef);
            return [action.order, ...remainingOrders];
        default:
           return state;
    }
}
