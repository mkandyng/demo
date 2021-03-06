import React from "react";
import ReactTable from "react-table";
import {orderStatusEnum} from "../orderStatusEnum";
import PropTypes from 'prop-types';
import "./orderbook.css";

/**
 * Component to handle orderbook view and interaction
 */
export default function Orderbook({orders}) {

  return (<ReactTable defaultPageSize={10}
                      showPageSizeOptions={false}
                      data={orders} columns={orderBookHeaderColumns}
                      getTheadThProps={handleTableColumnHeader}
                      getTrProps={handleTableRow}/>);
}

const orderBookHeaderColumns = [
  {
    Header: "Order Ref",
    accessor: "orderRef",
    width: 80
  }, {
    Header: "Symbol",
    accessor: "symbol",
    width: 50
  }, {
    Header: "Created",
    accessor: "created",
    width: 120
  }, {
    Header: "Last Updated",
    accessor: "lastUpdated",
    width: 120
  }, {
    Header: "Instrument",
    accessor: "instrument",
    className: "instrument-column"
  }, {
    Header: "Status",
    accessor: "status",
    width: 70
  }, {
    Header: "Ccy",
    accessor: "ccy",
    width: 40
  }, {
    Header: "Buy/Sell",
    accessor: "buySell",
    width: 50
  }, {
    Header: "Qty",
    accessor: "quantity",
    width: 50
  }, {
    Header: "Executed",
    accessor: "executed",
    width: 60
  }, {
    Header: "Order Type",
    accessor: "orderType",
    width: 70
  }, {
    Header: "Order Price",
    accessor: "price",
    width: 70
  }, {
    Header: "Price (avg)",
    accessor: "avgPrice",
    width: 70
  }, {
    Header: "Expiry Type",
    accessor: "expiryType",
    width: 70
  }, {
    Header: "Expiry Date",
    accessor: "expiryDate",
    width: 70
  }
];

function handleTableColumnHeader() {
  return {
    style: {
      height: "30px"
    }
  }
}

function handleTableRow(state, rowInfo, column) {
  const orderStatus = rowInfo? orderStatusEnum.getOrderStatus(rowInfo.original.status): undefined
  const backgroundColor = orderStatus? orderStatus.backgroundColor: "white";
  const color = orderStatus? orderStatus.color: "black";
  return {
    style: {
      backgroundColor: backgroundColor,
      color: color
    }
  }
}

Orderbook.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired
};
