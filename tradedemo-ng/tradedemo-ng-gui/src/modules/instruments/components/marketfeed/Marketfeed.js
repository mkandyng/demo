import React, {useState, useEffect} from "react";
import ReactTable from "react-table";
import { getRandomInt } from "../../../../libs/utils";
import { generateMarketfeedMovement } from "../../../../libs/marketfeed";
import "./marketfeed.css";

/**
 * Component to handle Marketfeed view and interaction
 */
export default function Marketfeed({ marketfeedInstruments,
                                     instrument,
                                     selectMarketfeedInstrument,
                                     deleteMarketfeedInstrument,
                                     updateMarketfeedInstrument }) {

    const [marketfeedCounter, updateMarkfeedCounter] = useState(0);

    useEffect(() => {
      const flashPriceUpdate = () => {
           const flashCount = 2;
           const instrumentIndex = getRandomInt(0, marketfeedInstruments.length);
           const randomInstrument = marketfeedInstruments[instrumentIndex];
           if(randomInstrument !== undefined) {
               const generatedInstrument = generateMarketfeedMovement(randomInstrument);
               if(generatedInstrument.open !== undefined) {
                   let counter = 0;
                   const flashInterval = setInterval(() => {
                       counter++;
                       let instrumentPrice = generatedInstrument;
                       if(counter === flashCount) {
                           clearInterval(flashInterval);
                       } else {
                           if((counter % flashCount) !== 0) {
                               instrumentPrice = {...instrumentPrice, bid:"", ask:"" };
                           }
                       }
                       updateMarketfeedInstrument(instrumentPrice);
                   }, 500);
               }
           }
      };

      if(marketfeedCounter === marketfeedInstruments.length) {
          updateMarkfeedCounter(counter => counter+1);
          setInterval(() => {
              flashPriceUpdate();
          }, 2000);
      }

    }, [marketfeedInstruments, marketfeedCounter, updateMarketfeedInstrument] );

    const removeColumnHeader = (column) => column.Header === "Remove";

    const selectMarketfeed = symbol => {
        const matchedInstrument = marketfeedInstruments.find(e => e.symbol === symbol);
        selectMarketfeedInstrument(matchedInstrument);
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
                  if(marketfeedInstruments.length > 1) {
                      const nextSymbol = index === 0 ? marketfeedInstruments[1].symbol:
                                                       marketfeedInstruments[0].symbol;
                      deleteMarketfeedInstrument(instrument);
                      selectMarketfeed(nextSymbol);
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
       const matchedPredicate = e => e.symbol === instrument.symbol;
       const selectedIndex = marketfeedInstruments.findIndex(matchedPredicate);
       return {
           onClick: (e) => {
              if(e.target.src === undefined || !e.target.src.indexOf("delete")) {
                  const symbol = marketfeedInstruments[index].symbol;
                  selectMarketfeed(symbol);
              }
           },
           style: {
              background: selectedIndex === index? "#f5f2f2": null
           }
       };
    };

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

    const eventHandler = {
        handleTableColumn: handleTableColumn,
        handleTableRow: handleTableRow
    };

    return (
      <MarketfeedView instruments={marketfeedInstruments}
                      columnHeaders={columnHeaders}
                      eventHandler={eventHandler} />
   );
}

export function MarketfeedView({instruments, columnHeaders, eventHandler}) {
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
          getTrProps={eventHandler.handleTableRow} />
    );
}
