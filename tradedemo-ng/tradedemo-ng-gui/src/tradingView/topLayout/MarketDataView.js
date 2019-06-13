import React from "react";
import ReactTable from "react-table";

/**
 * Component to display MarketData
 */
export default function MarketDataView(props) {
    const { marketfeed } = props;
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
    const removeColumnHeader = (column) => column.Header === "Remove";

    const selectMarketfeedInstrument = symbol => {
        const matchedInstrument = props.marketfeed.instruments.find(e => e.symbol === symbol);
        props.selectInstrumentToMarketfeed(matchedInstrument);
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
                if(marketfeed.instruments.length > 1) {
                    const nextSymbol = index === 0 ? marketfeed.instruments[1].symbol:
                                                     marketfeed.instruments[0].symbol;
                    props.deleteInstrumentToMarketfeed(instrument);
                    selectMarketfeedInstrument(nextSymbol);
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
       const matchedPredicate = instrument => instrument.symbol === marketfeed.selected.symbol;
       const selectedIndex = marketfeed.instruments.findIndex(matchedPredicate);
       return {
         onClick: (e) => {
            if(e.target.src === undefined || !e.target.src.indexOf("delete")) {
                const symbol = marketfeed.instruments[index].symbol;
                selectMarketfeedInstrument(symbol);
            }
         },
         style: {
            background: selectedIndex === index? "#f5f2f2": null
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
            data={marketfeed.instruments}
            columns={columnHeaders}
            getTdProps={handleTableColumn}
            getTrProps={handleTableRow}
      />
   );
}
