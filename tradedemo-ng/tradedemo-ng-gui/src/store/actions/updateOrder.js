import { getDateString } from "../../common/libs/utils";

export const UPDATE_ORDER = "UPDATE_ORDER";

export const updateOrder = order => ({
    type: UPDATE_ORDER,
    order: { ...order,
       lastUpdated: getDateString(new Date(), "dateTimeFormat")
     }
});
