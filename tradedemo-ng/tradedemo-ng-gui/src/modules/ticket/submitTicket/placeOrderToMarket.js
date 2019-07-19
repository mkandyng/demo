import {getRandomInt} from "../../../libs/utils";
import {orderStatusEnum} from "../../orders/orderStatusEnum";

/**
 * [placeOrderToMarket entry point to call placeOrder and kick off order life cycle]
 * @param  {[Object]} order       [order entries]
 * @param  {[Function]} placeOrder  [Action creator to placeOrder to affect orderbook state]
 * @param  {[Function]} updateOrder [Action creator to updateOrder to affect orderbook state]
 * @return {[Void]}
 */
export default function placeOrderToMarket(order, placeOrder, updateOrder) {
  const orderPlaced = {...order,executed: 0,status: orderStatusEnum.status.REQUESTED.displayName};
  placeOrder(orderPlaced);
  const orderEndStatus = orderStatusEnum.getRandomFinalOrderStatus();
  const nextStatus = getNextStatusAfterPlace(order, orderEndStatus);

  setTimeout(() => {
    updateOrder({...orderPlaced,status: nextStatus.displayName});

    // Only fill the rest if it is working
    if (nextStatus.displayName === orderStatusEnum.status.WORKING.displayName) {
      if ((orderEndStatus.displayName !== orderStatusEnum.status.WORKING.displayName) ||
        (order.orderType === "Market")) {
        updateOrderWithFill(orderEndStatus, orderPlaced, updateOrder);
      }
    }
  }, getRandomInt(300, 2000));
}

function updateOrderWithFill(endStatus, order, updateOrder) {
  const priceMargin = order.midPrice * (getRandomInt(1, 5) * 0.01);
  const price = order.orderType === "Market" ? order.midPrice : order.price;
  const avgPrice = getRandomInt(0, 1) === 0 ? price - priceMargin : price + priceMargin;
  const executed = order.executed + 1;

  let status = orderStatusEnum.status.PARTFILLED;
  if (executed === order.quantity) {
    status = orderStatusEnum.status.FILLED;
  }

  const orderToUpdate = {
    ...order,
    status: status.displayName,
    avgPrice: avgPrice.toFixed(2),
    executed: executed
  };

  setTimeout(() => {
    updateOrder(orderToUpdate);
    if (isNotFullyFill(orderToUpdate, endStatus)) {
      updateOrderWithFill(endStatus, orderToUpdate, updateOrder);
    }
  }, getRandomInt(500, 3000));
}

function getNextStatusAfterPlace(checkOrder, orderEndStatus) {
  let nextStatus = orderStatusEnum.status.WORKING;
  if (orderEndStatus.displayName === orderStatusEnum.status.REJECTED.displayName) {
    nextStatus = orderStatusEnum.status.REJECTED;
  } else if ((checkOrder.expiryType === "FOK") && (orderEndStatus.displayName === orderStatusEnum.status.CANCELLED.displayName)) {
    nextStatus = orderStatusEnum.status.CANCELLED;
  }
  return nextStatus;
}

function isNotFullyFill(checkOrder, endStatus) {
  return (checkOrder.status !== endStatus.displayName) &&
    (checkOrder.executed < checkOrder.quantity);
}
