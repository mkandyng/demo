import { ORDERBOOK_STATUS } from "../../common//orderbook";
import { getDateString } from "../../common//utils";

export const ORDERBOOK = ({
    PLACE_ORDER: "PLACE_ORDER",
    UPDATE_ORDER: "UPDATE_ORDER"
})

export const placeOrder = order => ({
    type: ORDERBOOK.PLACE_ORDER,
    order: { ...order,
       status: ORDERBOOK_STATUS.requested.displayName
     }
});

export const updateOrder = order => ({
    type: ORDERBOOK.UPDATE_ORDER,
    order: { ...order,
       lastUpdated: getDateString(new Date(), "dateTimeFormat")
     }
});
