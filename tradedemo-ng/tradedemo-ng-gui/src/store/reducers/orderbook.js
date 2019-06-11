import {
    PLACE_ORDER
} from "../actions/placeOrder";

import {
   UPDATE_ORDER
} from "../actions/updateOrder";

export default function orderbook(state = [], action) {
    switch (action.type) {
      case PLACE_ORDER:
          return [action.order, ...state];
      case UPDATE_ORDER:
          const remainingOrders = state.filter(order => order.orderRef !== action.order.orderRef);
          return [action.order, ...remainingOrders];
      default:
         return state;
    }
}
