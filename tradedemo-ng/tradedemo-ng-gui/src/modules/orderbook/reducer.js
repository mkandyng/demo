import * as types from "./actionTypes";

export const NAME = "orderbook";

export default function reducer(state = [], action) {
    switch (action.type) {
      case types.PLACE_ORDER:
          return [action.order, ...state];
      case types.UPDATE_ORDER:
          const remainingOrders = state.filter(order => order.orderRef !== action.order.orderRef);
          return [action.order, ...remainingOrders];
      default:
         return state;
    }
}
