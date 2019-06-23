import { types } from "./actions";

export const NAME = "ticket";

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

export default function reducer(state = initState, action) {
    switch (action.type) {
      case types.UPDATE_TICKET:
          return {...state, ...action.ticketProps}
      default:
         return state;
    }
}
