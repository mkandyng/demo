import React, {useState, useEffect} from "react";
import ReactTable from "react-table";
import { getRandomInt } from "../../../libs/utils";
import { MAX_MARKET_FEED_INSTRUMENTS } from "../index";
import generateMarketfeedMovement from "../generateMarketfeedMovement";
import PropTypes from 'prop-types';
import "./instrumentsMarketfeed.css";

/**
 * Component to handle Marketfeed view and interaction
 */
export default function InstrumentsMarketfeed({
                                     marketfeedInstruments,
                                     instrument,
                                     selectMarketfeedInstrument,
                                     deleteMarketfeedInstrument,
                                     updateMarketfeedInstrument }) {

    // marketfeedCounter ensure only generate one interval after populated marketfeed
    const [marketfeedCounter, updateMarkfeedCounter] = useState(MAX_MARKET_FEED_INSTRUMENTS);
    useEffect(() => {
        if(marketfeedCounter === marketfeedInstruments.length) {
            updateMarkfeedCounter(counter => counter+1);
            setInterval(() => {
                flashPriceUpdate(marketfeedInstruments, updateMarketfeedInstrument);
            }, 500);
        }
    }, [marketfeedInstruments, marketfeedCounter, updateMarketfeedInstrument] );

    const eventHandlers = {
        handleTableColumn: (state, rowInfo, column) => {
            return handleTableColumn(state,
                                     rowInfo,
                                     column,
                                     marketfeedInstruments,
                                     deleteMarketfeedInstrument,
                                     selectMarketfeedInstrument);
        },
        handleTableRow: (state, rowInfo) => {
            return handleTableRow(state,
                                  rowInfo,
                                  instrument,
                                  marketfeedInstruments,
                                  selectMarketfeedInstrument);
        }
    };

    return (
        <InstrumentsMarketfeedView
                      instruments={marketfeedInstruments}
                      columns={columnHeaders}
                      eventHandlers={eventHandlers} />
    );
}

export function InstrumentsMarketfeedView({instruments, columns, eventHandlers}) {
    return (
      <ReactTable
          defaultPageSize={MAX_MARKET_FEED_INSTRUMENTS}
          sortable={false}
          showPaginationTop={false}
          showPaginationBottom={false}
          showPageSizeOptions={false}
          data={instruments}
          columns={columns}
          getTdProps={eventHandlers.handleTableColumn}
          getTrProps={eventHandlers.handleTableRow} />
    );
}

export const columnHeaders = [
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

/**
 * [flashPriceUpdate trigger an update of marketfeed price of one of the instruments]
 * @param  {[Array]} marketfeedInstruments      [Array of instruments in the marketfeed]
 * @param  {[Function]} updateMarketfeedInstrument [Action to change state of marketfeed]
 * @return {[Boolean]}                            [Inform if update successful or not]
 */
function flashPriceUpdate(marketfeedInstruments, updateMarketfeedInstrument) {
    if(marketfeedInstruments.length > 0) {
        const instrumentIndex = getRandomInt(0, marketfeedInstruments.length-1);
        const randomInstrument = marketfeedInstruments[instrumentIndex];
        updateMarketfeedInstrument({...randomInstrument, bid:"", ask:"" });
        setTimeout(() => updateMarketfeedInstrument(generateMarketfeedMovement(randomInstrument)),500);
        return true;
    }
    return false;
};

function removeColumnHeader(column) { return column.Header === "Remove"};

function selectMarketfeed(symbol, marketfeedInstruments, selectMarketfeedInstrument){
    const matchedInstrument = marketfeedInstruments.find(e => e.symbol === symbol);
    selectMarketfeedInstrument(matchedInstrument);
};

function handleTableRow(state,
                        rowInfo,
                        instrument,
                        marketfeedInstruments,
                        selectMarketfeedInstrument) {
   const index = rowInfo ? rowInfo.index : -1;
   const matchedPredicate = e => e.symbol === instrument.symbol;
   const selectedIndex = marketfeedInstruments.findIndex(matchedPredicate);
   return {
       onClick: (e) => {
          if(e.target.src === undefined || !e.target.src.indexOf("delete")) {
              const symbol = marketfeedInstruments[index].symbol;
              selectMarketfeed(symbol, marketfeedInstruments, selectMarketfeedInstrument);
          }
       },
       style: {
          background: selectedIndex === index? "#f5f2f2": null
       }
   };
};

function handleTableColumn(state,
                           rowInfo,
                           column,
                           marketfeedInstruments,
                           deleteMarketfeedInstrument,
                           selectMarketfeedInstrument) {
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
                  selectMarketfeed(nextSymbol, marketfeedInstruments, selectMarketfeedInstrument);
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


InstrumentsMarketfeed.propTypes = {
    marketfeedInstruments: PropTypes.arrayOf(PropTypes.object).isRequired,
    instrument: PropTypes.object.isRequired,
    selectMarketfeedInstrument: PropTypes.func.isRequired,
    deleteMarketfeedInstrument: PropTypes.func.isRequired,
    updateMarketfeedInstrument: PropTypes.func.isRequired
};

InstrumentsMarketfeedView.propTypes = {
    instruments: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    eventHandlers: PropTypes.objectOf(PropTypes.func).isRequired
};
