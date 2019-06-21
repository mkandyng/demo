import { getRandomInt, getDateString } from "../../common/utils.js"
import { orderbookStatus } from "../../common/orderbook"

export function submitOrder({ ticket,
                              instrument,
                              buySell,
                              confirmOrder,
                              placeOrder,
                              updateOrder }) {

    const isFullyFill = function(checkOrder, endStatus) {
        return (checkOrder.status !== endStatus.displayName) &&
                (checkOrder.executed < checkOrder.quantity);
    }

    const getNextStatus = function(checkOrder, orderEndStatus) {
        let nextStatus = orderbookStatus.WORKING;
        if(orderEndStatus.displayName === orderbookStatus.REJECTED.displayName) {
           nextStatus = orderbookStatus.REJECTED;
        } else if((checkOrder.expiryType === "FOK") && (orderEndStatus.displayName === orderbookStatus.CANCELLED.displayName)) {
           nextStatus = orderbookStatus.CANCELLED;
        }
        return nextStatus;
    }

    const validateOrder = function(ticket, instrument) {
        if(ticket.quantity === 0) {
            alert("Quantity must be greater than 0");
            return false;
        }

        if(ticket.expiryType === "GTD") {
            var today = new Date();
            today.setHours(1,0,0,0);
            var inputDate = new Date(ticket.expiryDate);
            if(inputDate < today) {
                alert("GTD date must be greater or equals to today [" + getDateString(today, "dateOnly") + "]");
                return false;
            }
        }

        if(ticket.orderType !== "Market") {
            if(Math.abs(ticket.price - instrument.price) > (instrument.price * 0.05)) {
                alert("Price " + ticket.price + " is outside 5% of midPrice [" + instrument.price.toFixed(2) + "]");
                return false;
            }
        }
        return true;
    }

    const updateOrderWithFill = function(endStatus, order) {
        const priceMargin = order.midPrice * (getRandomInt(1,5) * 0.01);
        const price = order.orderType === "Market" ? order.midPrice : order.price;
        const avgPrice = getRandomInt(0,1) === 0? price - priceMargin : price + priceMargin;
        const executed = order.executed + 1;

        let status = orderbookStatus.PARTFILLED;
        if(executed === order.quantity) {
           status = orderbookStatus.FILLED;
        }

        const orderToUpdate = { ...order,
              status: status.displayName,
              avgPrice: avgPrice.toFixed(2),
             executed: executed
        };

        const interval = setInterval(() => {
            clearInterval(interval);
            updateOrder(orderToUpdate);
            if(isFullyFill(orderToUpdate, endStatus)) {
               updateOrderWithFill(endStatus, orderToUpdate);
            }
        }, getRandomInt(500,2000));
    }

    const placeOrderAndGenerateTradeLifeCycle = function(order) {
        const orderEndStatus = orderbookStatus.getRandomFinalOrderStatus();
        const createdDate = getDateString(new Date(), "dateTimeFormat");
        let orderToUpdate = { ...order,
           created: createdDate,
           lastUpdated: createdDate
        };

        placeOrder(orderToUpdate);

        const workingInterval = setInterval(() => {
           clearInterval(workingInterval);
              const nextStatus = getNextStatus(order, orderEndStatus);
               updateOrder({
                    ...orderToUpdate,
                    status: nextStatus.displayName
               });

               // Only fill the rest if it is working
               if(nextStatus.displayName === orderbookStatus.WORKING.displayName) {
                  if((orderEndStatus.displayName !== orderbookStatus.WORKING.displayName) ||
                     (order.orderType === "Market")) {
                       updateOrderWithFill(orderEndStatus, orderToUpdate);
                  }
               }
        }, getRandomInt(300,700));
    }

    if(validateOrder(ticket, instrument)) {
        const priceInfo = ticket.orderType === "Market" ? "Market price": ticket.orderType + " (" + ticket.price + ")";
        let confirmedPlaceOrder = true;
        if(confirmOrder) {
            //eslint-disable-next-line
            confirmedPlaceOrder = confirm(buySell + " " + ticket.quantity + " " + instrument.name + " @ " + priceInfo);
        }

        if(confirmedPlaceOrder) {
            const padDigits = function(number, digits) {
                return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
            }

            placeOrderAndGenerateTradeLifeCycle({
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
            });
            return true;
        }
        return false;
    }
}
