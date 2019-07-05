import { padDigits, getDateString } from "../../../libs/utils";
import placeOrderToMarket from "./placeOrderToMarket";
import validateOrder from "./validateOrder";

/**
 * [submitTicket exposed API to submit ticket by delegating to sub modules validate and place ]
 * @param  {[Object]} ticket       [input data gather on order ticket]
 * @param  {[Object]} instrument   [supplied data from the selected instrument]
 * @param  {[String]} buySell      [buy or sell indicator]
 * @param  {[Boolean]} confirmOrder [flag to determine whether user needs confirmation]
 * @param  {[Function]} placeOrder   [Action creator to affect orderbook state by adding a new order]
 * @param  {[Function]} updateOrder  [Action creator to affect orderbook state of a given order]
 * @return {[Boolean]}              [Indicator on success/failure of operation]
 */
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
                created: getDateString(new Date(), "dateTimeFormat"),
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
