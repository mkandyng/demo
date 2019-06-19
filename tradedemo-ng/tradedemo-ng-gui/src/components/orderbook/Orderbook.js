import React from "react";
import { ORDERBOOK_STATUS } from "../../common/orderbook";
import OrderbookView from "./OrderbookView";

/**
 * Component to display Orderbook
 */
export default function Orderbook(props) {
    const { orderbook } = props;

    const getOrderStatus = function(displayName) {
        const status = Object.keys(ORDERBOOK_STATUS).find(status => ORDERBOOK_STATUS[status].displayName === displayName);
        return ORDERBOOK_STATUS[status];
    }

    const eventHandler = {
        getTheadThProps: () => {
              return {
                style: {
                     height: "30px"
                 }
              }
        },
        getTrProps: (state, rowInfo, column) => {
             const orderStatus = rowInfo?getOrderStatus(rowInfo.original.status):undefined
             const backgroundColor = orderStatus ? orderStatus.backgroundColor: "white";
             const color = orderStatus ? orderStatus.color: "black";
             return {
                  style: {
                      backgroundColor: backgroundColor,
                      color: color
                  }
             }
        }
    };

    return (
      <OrderbookView orderbook={orderbook}
                     eventHandler={eventHandler} />
    );
}
