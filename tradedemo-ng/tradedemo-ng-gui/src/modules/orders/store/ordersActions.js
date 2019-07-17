import {
  orderStatusEnum
} from "../orderStatusEnum";
import {
  getDateString
} from "../../../libs/utils";

export const types = {
  PLACE_ORDER: "orders/PLACE_ORDER",
  UPDATE_ORDER: "ordersUPDATE_ORDER"
};

export const placeOrder = order => ({
  type: types.PLACE_ORDER,
  order: {
    ...order,
    status: orderStatusEnum.status.REQUESTED.displayName,
    lastUpdated: order.created
  }
});

export const updateOrder = order => ({
  type: types.UPDATE_ORDER,
  order: {
    ...order,
    lastUpdated: getDateString(new Date(), "dateTimeFormat")
  }
});
