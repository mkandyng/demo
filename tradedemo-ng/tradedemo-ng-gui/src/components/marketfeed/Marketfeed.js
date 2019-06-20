import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactTable from "react-table";
import { getRandomInt } from "../../common/utils";
import { generateMarketDataMovement } from "../../common/marketfeed";
import { selectInstrumentToMarketfeed,
         updateInstrumentToMarketfeed,
         deleteInstrumentToMarketfeed } from "../../store/marketfeed/marketfeedActions";
import "./marketfeed.css";
/**
 * Component to display MarketData
 */
export function Marketfeed(props) {

    const { marketfeed,
            selectInstrumentToMarketfeed,
            deleteInstrumentToMarketfeed,
            updateInstrumentToMarketfeed } = props;

    const [marketfeedCounter, updateMarkfeedCounter] = useState(0);

    useEffect(() => {
      const flashPriceUpdate = () => {
           const flashCount = 2;
           const instrumentIndex = getRandomInt(0, marketfeed.instruments.length);
           const randomInstrument = marketfeed.instruments[instrumentIndex];
           if(randomInstrument !== undefined) {
               const generatedInstrument = generateMarketDataMovement(randomInstrument);
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
                       updateInstrumentToMarketfeed(instrumentPrice);
                   }, 500);
               }
           }
      };

      if(marketfeedCounter === marketfeed.instruments.length) {
          updateMarkfeedCounter(counter => counter+1);
          setInterval(() => {
              flashPriceUpdate();
          }, 2000);
      }

    }, [marketfeed.instruments, marketfeedCounter, updateInstrumentToMarketfeed] );

    const removeColumnHeader = (column) => column.Header === "Remove";

    const selectMarketfeedInstrument = symbol => {
        const matchedInstrument = marketfeed.instruments.find(
                                          e => e.symbol === symbol
                                  );
        selectInstrumentToMarketfeed(matchedInstrument);
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
                      deleteInstrumentToMarketfeed(instrument);
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
      <MarketfeedView instruments={marketfeed.instruments}
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

const mapStateToProps = state => ({ instruments: state.instruments,
                                    marketfeed: state.marketfeed });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
       selectInstrumentToMarketfeed,
       updateInstrumentToMarketfeed,
       deleteInstrumentToMarketfeed,
    }, dispatch);

// The HOC
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Marketfeed);
