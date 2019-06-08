import { ORDERBOOK_STATUS } from "../../libs/orderbook";

export const PLACE_ORDER = "PLACE_ORDER";

export const placeOrder = (order) => ({
    type: PLACE_ORDER,
    order: { ...order,
       status: ORDERBOOK_STATUS.requested.displayName
     }

});
