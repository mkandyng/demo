import { orderbookStatusEnum } from "../../../libs/orderbookStatusEnum";
import { getDateString } from "../../../libs/utils";

export const types = {
    PLACE_ORDER: "orderbook/PLACE_ORDER",
    UPDATE_ORDER: "orderbook/UPDATE_ORDER"
};

export const placeOrder = order => ({
    type: types.PLACE_ORDER,
    order: { ...order,
       status: orderbookStatusEnum.status.REQUESTED.displayName,
       lastUpdated: order.created
     }
});

export const updateOrder = order => ({
    type: types.UPDATE_ORDER,
    order: { ...order,
       lastUpdated: getDateString(new Date(), "dateTimeFormat")
     }
});