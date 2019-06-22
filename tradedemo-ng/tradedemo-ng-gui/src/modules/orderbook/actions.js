import * as types from "./actionTypes";
import { orderbookStatus } from "./libs";
import { getDateString } from "../../libs/utils";

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
