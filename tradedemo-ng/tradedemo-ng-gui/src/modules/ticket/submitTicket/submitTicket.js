import { padDigits } from "../../../libs/utils";
import placeOrderToMarket from "./placeOrderToMarket";
import validateOrder from "./validateOrder";

export default function submitTicket({ ticket,
                                       instrument,
                                       buySell,
                                       confirmOrder,
                                       placeOrder,
                                       updateOrder }) {

    if(validateOrder(ticket, instrument)) {
        const priceInfo = ticket.orderType === "Market" ? "Market price":
                                      ticket.orderType + " (" + ticket.price + ")";
        let confirmedPlaceOrder = true;
        if(confirmOrder) {
            //eslint-disable-next-line
            confirmedPlaceOrder = confirm(buySell + " " + ticket.quantity + " " +
                                          instrument.name + " @ " + priceInfo);
        }

        if(confirmedPlaceOrder) {
            placeOrderToMarket({
                orderRef:"XA"+ padDigits(ticket.orderId, 8),
                executed: 0,
                buySell: buySell,
                symbol: instrument.symbol,
                instrument: instrument.name,
                ccy: instrument.currency,
                midPrice: instrument.price,
                expiryType: ticket.expiryType,
                expiryDate: ticket.expiryDate,
                orderType: ticket.orderType,
                price: ticket.orderType === "Market" ? "": Number(ticket.price),
                quantity: ticket.quantity,
                note: ticket.note
            }, placeOrder, updateOrder);

            return true;
        }
    }
    return false;
}
