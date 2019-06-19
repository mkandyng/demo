import React from "react";
import { connect } from "react-redux";
import { getOrderStatus } from "../../common/libs/orderbook";
import OrderbookView from "./OrderbookView";

/**
 * Component to display Orderbook
 */
function Orderbook(props) {

    const { orderbook } = props;

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

const mapStateToProps = state => ({ orderbook: state.orderbook });

// The HOC
export default connect(
    mapStateToProps
)(Orderbook);
