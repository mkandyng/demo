import {
    ORDERBOOK
} from "./orderbookActions";

export default function orderbookReducer(state = [], action) {
    switch (action.type) {
      case ORDERBOOK.PLACE_ORDER:
          return [action.order, ...state];
      case ORDERBOOK.UPDATE_ORDER:
          const remainingOrders = state.filter(order => order.orderRef !== action.order.orderRef);
          return [action.order, ...remainingOrders];
      default:
         return state;
    }
}
