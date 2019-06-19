import { getRandomInt, getDateString } from "./utils.js"

export const ORDERBOOK_STATUS = {
    requested: { displayName: "Requested", backgroundColor: "#575A57", color: "white"},
    working: {displayName: "Working", backgroundColor: "white", color: "black"},
    partFilled: {displayName: "PartFilled", backgroundColor: "#F3ED19", color: "black"},
    filled: {displayName: "Filled", backgroundColor: "#27B021", color: "white"},
    cancelled: {displayName: "Cancelled", backgroundColor: "#07A6FB", color: "white"},
    rejected: {displayName: "Rejected", backgroundColor: "#F92E05", color: "white"},
}

export function validateAndPlaceOrder(props) {
    const { ticket,
            instrument,
            buySell,
            price,
            confirmOrder,
            placeOrder,
            updateOrder } = props;
            
    if(validateOrder(ticket, instrument)) {
        const priceInfo = ticket.orderType === "Market" ? "Market price": ticket.orderType + " (" + this.state.price + ")";
        let confirmedPlaceOrder = true;
        if(confirmOrder) {
            //eslint-disable-next-line
            confirmedPlaceOrder = confirm(buySell + " " + ticket.quantity + " " + instrument.name + " @ " + priceInfo);
        }

        if(confirmedPlaceOrder) {
            const padDigits = function(number, digits) {
                return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
            }

            placeOrderAndGenerateTradeLifeCycle({placeOrder, updateOrder}, {
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
                price: ticket.orderType === "Market" ? "": price,
                quantity: ticket.quantity,
                note: ticket.note
            });
            return true;
        }
        return false;
    }
}

function validateOrder(ticket, instrument) {
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

function getRandomFinalOrderStatus() {
    const arrayOrderbookStatus = Object.keys(ORDERBOOK_STATUS);
    const status = arrayOrderbookStatus[getRandomInt(0,arrayOrderbookStatus.length-1)];
    return ORDERBOOK_STATUS[status];
}

function updateOrderWithFill(updateFunc, endStatus, order) {
    const priceMargin = order.midPrice * (getRandomInt(1,5) * 0.01);
    const price = order.orderType === "Market" ? order.midPrice : order.price;
    const avgPrice = getRandomInt(0,1) === 0? price - priceMargin : price + priceMargin;
    const executed = order.executed + 1;

    let status = ORDERBOOK_STATUS.partFilled;
    if(executed === order.quantity) {
       status = ORDERBOOK_STATUS.filled;
    }

    const updatedOrder = { ...order,
          status: status.displayName,
          avgPrice: avgPrice.toFixed(2),
         executed: executed
    };

    const interval = setInterval(() => {
        clearInterval(interval);
        updateFunc(updatedOrder);
        if((updatedOrder.status !== endStatus.displayName) && updatedOrder.executed < updatedOrder.quantity) {
           updateOrderWithFill(updateFunc, endStatus, updatedOrder);
        }
    }, getRandomInt(500,2000));
}

function placeOrderAndGenerateTradeLifeCycle({placeOrder, updateOrder}, order) {
    const orderEndStatus = getRandomFinalOrderStatus();
    const createdDate = getDateString(new Date(), "dateTimeFormat");
    let updatedOrder = { ...order,
       created: createdDate,
       lastUpdated: createdDate
    };

    placeOrder(updatedOrder);

    const workingInterval = setInterval(() => {
       clearInterval(workingInterval);
           let nextStatus = ORDERBOOK_STATUS.working;
           if(orderEndStatus.displayName === ORDERBOOK_STATUS.rejected.displayName) {
              nextStatus = ORDERBOOK_STATUS.rejected;
           } else if((order.expiryType === "FOK") && (orderEndStatus.displayName === ORDERBOOK_STATUS.cancelled.displayName)) {
              nextStatus = ORDERBOOK_STATUS.cancelled;
           }

           updateOrder({
                ...updatedOrder,
                status: nextStatus.displayName
           });

           // Only fill the rest if it is working
           if(nextStatus.displayName === ORDERBOOK_STATUS.working.displayName) {
              if((orderEndStatus.displayName !== ORDERBOOK_STATUS.working.displayName) ||
                 (order.orderType === "Market")) {
                   updateOrderWithFill(updateOrder, orderEndStatus, updatedOrder);
              }
           }
    }, getRandomInt(300,700));
}
