import React from "react";
import ReactTable from "react-table";
import "./marketfeed.css";

/**
 * Component to display MarketData
 */
export default function MarketfeedView(props) {
    const { instruments,
            eventHandler } = props;
    const columnHeaders = [
          { Header: "Remove", accessor: "delete", width: 70 },
          { Header: "Symbol", accessor: "symbol", width: 100 },
          { Header: "Instrument Name", accessor: "name", className: "instrument-column" },
          { Header: "Ccy", accessor: "currency", width: 70 },
          { Header: "Bid", accessor: "bid", width: 70 },
          { Header: "Ask", accessor: "ask", width: 70 },
          { Header: "Last", accessor: "last", width: 70 },
          { Header: "Open", accessor: "open", width: 70},
          { Header: "Chg", accessor: "chg", width: 70 }
    ];
    return (
        <ReactTable
            defaultPageSize={5}
            sortable={false}
            showPaginationTop={false}
            showPaginationBottom={false}
            showPageSizeOptions={false}
            data={instruments}
            columns={columnHeaders}
            getTdProps={eventHandler.handleTableColumn}
            getTrProps={eventHandler.handleTableRow}
      />
   );
}
