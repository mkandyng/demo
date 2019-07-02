import * as ticketActions from "./ticketActions";

export const NAME = "ticket";

export default function ticketReducer(state = initState, action) {
    switch (action.type) {
        case ticketActions.types.UPDATE_TICKET:
            return {...state, ...action.ticketProps}
        default:
           return state;
    }
}

const initState = { symbol: undefined,
                    orderId:0,
                    quantity: 5,
                    orderType: "Market",
                    price: 0,
                    expiryType: "Day",
                    expiryDate: "",
                    note: "",
                    priceStyle: {opacity: "0.5"},
                    expiryDateStyle: {opacity: "0.5"}};
