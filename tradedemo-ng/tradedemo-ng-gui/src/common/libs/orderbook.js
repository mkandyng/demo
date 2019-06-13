import { getRandomInt, getDateString } from "./utils.js"

export const ORDERBOOK_STATUS = {
    requested: { displayName: "Requested", backgroundColor: "#575A57", color: "white"},
    working: {displayName: "Working", backgroundColor: "white", color: "black"},
    partFilled: {displayName: "PartFilled", backgroundColor: "#F3ED19", color: "black"},
    filled: {displayName: "Filled", backgroundColor: "#27B021", color: "white"},
    cancelled: {displayName: "Cancelled", backgroundColor: "#07A6FB", color: "white"},
    rejected: {displayName: "Rejected", backgroundColor: "#F92E05", color: "white"},
}

export const getRandomFinalOrderStatus = function() {
    const arrayOrderbookStatus = Object.keys(ORDERBOOK_STATUS);
    const status = arrayOrderbookStatus[getRandomInt(0,arrayOrderbookStatus.length-1)];
    return ORDERBOOK_STATUS[status];
}

export const getOrderStatus = function(displayName) {
    const status = Object.keys(ORDERBOOK_STATUS).find(status => ORDERBOOK_STATUS[status].displayName === displayName);
    return ORDERBOOK_STATUS[status];
}

export const updateOrderWithFill = function(updateFunc, endStatus, order) {
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

export const placeOrderAndGenerateTradeLifeCycle = function(props, order) {
    const orderEndStatus = getRandomFinalOrderStatus();
    const createdDate = getDateString(new Date(), "dateTimeFormat");
    let updatedOrder = { ...order,
       created: createdDate,
       lastUpdated: createdDate
    };

    props.placeOrder(updatedOrder);

    const workingInterval = setInterval(() => {
       clearInterval(workingInterval);
           let nextStatus = ORDERBOOK_STATUS.working;
           if(orderEndStatus.displayName === ORDERBOOK_STATUS.rejected.displayName) {
              nextStatus = ORDERBOOK_STATUS.rejected;
           } else if((order.expiryType === "FOK") && (orderEndStatus.displayName === ORDERBOOK_STATUS.cancelled.displayName)) {
              nextStatus = ORDERBOOK_STATUS.cancelled;
           }

           props.updateOrder({
                ...updatedOrder,
                status: nextStatus.displayName
           });

           // Only fill the rest if it is working
           if(nextStatus.displayName === ORDERBOOK_STATUS.working.displayName) {
              if((orderEndStatus.displayName !== ORDERBOOK_STATUS.working.displayName) ||
                 (order.orderType === "Market")) {
                   updateOrderWithFill(props.updateOrder, orderEndStatus, updatedOrder);
              }
           }
    }, getRandomInt(300,700));
}
