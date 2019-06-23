import { orderbookStatus } from "../../libs/orderbook";
import { getDateString } from "../../libs/utils";

export const types = {
    PLACE_ORDER: "orderbook/PLACE_ORDER",
    UPDATE_ORDER: "orderbook/UPDATE_ORDER"
};

export const placeOrder = order => ({
    type: types.PLACE_ORDER,
    order: { ...order,
       status: orderbookStatus.REQUESTED.displayName
     }
});

export const updateOrder = order => ({
    type: types.UPDATE_ORDER,
    order: { ...order,
       lastUpdated: getDateString(new Date(), "dateTimeFormat")
     }
});
