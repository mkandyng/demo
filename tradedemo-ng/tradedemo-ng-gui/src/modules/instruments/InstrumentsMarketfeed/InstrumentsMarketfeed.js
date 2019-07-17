import React from "react";
import ReactTable from "react-table";
import {MAX_MARKET_FEED_INSTRUMENTS, MOUSE_OVER_IMAGE, MOUSE_OUT_IMAGE} from "../instruments";
import PropTypes from 'prop-types';
import "./instrumentsMarketfeed.css";

export const SELECTED_MARKET_FEED_ROW_COLOUR = "#f5f2f2";

/**
 * [InstrumentsMarketfeed Component to handle Marketfeed view and interaction]
 * @param       {[Array]} marketfeedInstruments      [store instruments.marketfeedInstruments]
 * @param       {[Array]} instrument                 [store instruments.selected]
 * @param       {[Function]} selectMarketfeedInstrument [action to select an instrument in the marketfeed]
 * @param       {[Function]} deleteMarketfeedInstrument [action to delete an instrument in the marketfeed]
 * @param       {[Function]} updateMarketfeedInstrument [action to update an instrument in the marketfeed]
 * @constructor
 */

export default function InstrumentsMarketfeed({
  marketfeedInstruments,
  instrument,
  selectMarketfeedInstrument,
  deleteMarketfeedInstrument,
  updateMarketfeedInstrument
}) {
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

  return (<InstrumentsMarketfeedView
                            instruments={marketfeedInstruments}
                            columns={columnHeaders}
                            eventHandlers={eventHandlers}/>);
}

function InstrumentsMarketfeedView({instruments, columns, eventHandlers}) {
  return (<ReactTable
                defaultPageSize={MAX_MARKET_FEED_INSTRUMENTS}
                sortable={false}
                showPaginationTop={false}
                showPaginationBottom={false}
                showPageSizeOptions={false}
                data={instruments}
                columns={columns}
                getTdProps={eventHandlers.handleTableColumn}
                getTrProps={eventHandlers.handleTableRow}/>);
}

export const columnHeaders = [
  {
    Header: "Remove",
    accessor: "delete",
    width: 70
  }, {
    Header: "Symbol",
    accessor: "symbol",
    width: 100
  }, {
    Header: "Instrument Name",
    accessor: "name",
    className: "instrument-column"
  }, {
    Header: "Ccy",
    accessor: "currency",
    width: 70
  }, {
    Header: "Bid",
    accessor: "bid",
    width: 70
  }, {
    Header: "Ask",
    accessor: "ask",
    width: 70
  }, {
    Header: "Last",
    accessor: "last",
    width: 70
  }, {
    Header: "Open",
    accessor: "open",
    width: 70
  }, {
    Header: "Chg",
    accessor: "chg",
    width: 70
  }
];

function removeColumnHeader(column) {
  return column.Header === "Remove";
}

function selectMarketfeed(symbol, marketfeedInstruments, selectMarketfeedInstrument) {
  const matchedInstrument = marketfeedInstruments.find(instrument => instrument.symbol === symbol);
  selectMarketfeedInstrument(matchedInstrument);
}

function handleTableRow(state, rowInfo, instrument, marketfeedInstruments, selectMarketfeedInstrument) {
  const index = rowInfo? rowInfo.index: -1;
  const matchedPredicate = e => e.symbol === instrument.symbol;
  const selectedIndex = marketfeedInstruments.findIndex(matchedPredicate);
  return {
    onClick: (e) => {
      if (e.target.src === undefined || !e.target.src.indexOf("delete")) {
        const symbol = marketfeedInstruments[index].symbol;
        if (symbol !== instrument.symbol) {
          selectMarketfeed(symbol, marketfeedInstruments, selectMarketfeedInstrument);
        }
      }
    },
    style: {
      background: selectedIndex === index? SELECTED_MARKET_FEED_ROW_COLOUR: null
    }
  };
};

function handleTableColumn(state,
                           rowInfo,
                           column,
                           marketfeedInstruments,
                           deleteMarketfeedInstrument,
                           selectMarketfeedInstrument) {
  const index = rowInfo? rowInfo.index: -1;
  return {
    onClick: (e) => {
      if (removeColumnHeader(column)) {
        const instrument = {
          symbol: rowInfo.original.symbol,
          name: rowInfo.original.name,
          currency: rowInfo.original.currency
        }
        if (marketfeedInstruments.length > 1) {
          const nextSymbol = index === 0? marketfeedInstruments[1].symbol: marketfeedInstruments[0].symbol;
          deleteMarketfeedInstrument(instrument);
          selectMarketfeed(nextSymbol, marketfeedInstruments, selectMarketfeedInstrument);
        } else {
          alert("Must have at least one instrument in the market feed");
        }
      }
    },
    onMouseOver: (e) => {
      if (removeColumnHeader(column)) {
        e.target.src = MOUSE_OVER_IMAGE;
      }
    },
    onMouseOut: (e) => {
      if (removeColumnHeader(column)) {
        e.target.src = MOUSE_OUT_IMAGE;
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
