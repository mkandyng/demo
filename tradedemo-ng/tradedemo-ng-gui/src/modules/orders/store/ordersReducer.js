import * as ordersActions from "./ordersActions";

export const NAME = "orders";

export function ordersReducer(state = [], action) {
  switch (action.type) {
    case ordersActions.types.PLACE_ORDER:
      return [action.order, ...state];
    case ordersActions.types.UPDATE_ORDER:
      const remainingOrders = state.filter(order => order.orderRef !== action.order.orderRef);
      return [action.order, ...remainingOrders];
    default:
      return state;
  }
}
