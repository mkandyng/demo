import React from "react";
import ReactTable from "react-table";
import { selectMarketfeedInstrument } from "../../../libs/marketfeed";

const MarketDataGrid = function(props) {
    const removeColumnHeader = (column) => column.Header === "Remove";
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
    const selectInstrument = (currentIndex, nextIndex, isRemove) => {
    let selectedIndex = nextIndex;
    if(isRemove && currentIndex === 0 && props.marketfeedInstruments.length > 1) {
        selectedIndex = 1;
    }
    selectMarketfeedInstrument(props, props.marketfeedInstruments[selectedIndex].symbol, nextIndex);
};

const handleTableColumn = (state, rowInfo, column) => {
    const index = rowInfo ? rowInfo.index : -1;
    return {
      onClick: (e) => {
        if(removeColumnHeader(column)) {
            let instrument = {
                symbol: rowInfo.original.symbol,
                name: rowInfo.original.name,
                currency: rowInfo.original.currency
            }

            if(props.marketfeedInstruments.length > 1) {
                props.deleteInstrumentToMarketfeed(instrument);
                selectInstrument(index, 0, true);
            } else {
                alert("Must have at least one instrument in the market feed");
            }
         }
      },
      onMouseOver: (e) => {
        if(removeColumnHeader(column)) {
            e.target.src="img/delete_click.png";
        }
      },
      onMouseOut: (e) => {
        if(removeColumnHeader(column)) {
            e.target.src="img/delete.png";
        }
      }
    };
  };

  const handleTableRow = function(state, rowInfo) {
     const index = rowInfo ? rowInfo.index : -1;
     return {
       onClick: (e) => {
          if(e.target.src === undefined || !e.target.src.indexOf("delete")) {
              selectInstrument(index, index, false);
          }
       },
       style: {
          background: props.selectedMarketfeedIndex === index? "#f5f2f2": null
       }
     };
  };

  return (
      <ReactTable
          defaultPageSize={5}
          sortable={false}
          showPaginationTop={false}
          showPaginationBottom={false}
          showPageSizeOptions={false}
          data={props.marketfeedInstruments}
          columns={columnHeaders}
          getTdProps={handleTableColumn}
          getTrProps={handleTableRow}
    />
  );
}

export default MarketDataGrid
