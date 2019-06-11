import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getRandomInt } from "../../common/libs/utils";
import { generateMarketDataMovement } from "../../common/libs/marketfeed";
import Ticket from "./TicketView";
import InstrumentSearch from "./InstrumentSearchView";
import MarketDataView from "./MarketDataView";
import { fetchInstruments } from "../../store/actions/fetchInstruments";
import { addInstrumentToMarketfeed } from "../../store/actions/addInstrumentToMarketfeed";
import { selectInstrumentToMarketfeed } from "../../store/actions/selectInstrumentToMarketfeed";
import { updateInstrumentToMarketfeed } from "../../store/actions/updateInstrumentToMarketfeed";
import { deleteInstrumentToMarketfeed } from "../../store/actions/deleteInstrumentToMarketfeed";
import { fetchInstrumentIntradayTimeSeries} from "../../store/actions/fetchInstrumentIntradayTimeSeries";
import { fetchInstrumentDailyTimeSeries} from "../../store/actions/fetchInstrumentDailyTimeSeries";

const TopLayoutContainer = function(props) {

     useEffect(() => {
        props.fetchInstruments();
        setInterval(() => {
            flashPriceUpdate();
        }, 1000);
     }, []);

     const { instruments,
             marketfeed,
             addInstrumentToMarketfeed,
             deleteInstrumentToMarketfeed,
             updateInstrumentToMarketfeed,
             selectInstrumentToMarketfeed,
             fetchInstrumentIntradayTimeSeries,
             fetchInstrumentDailyTimeSeries } = props;

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

      return (
          <div id="topLayout">
              <Ticket/>
              <div id="marketdata">
                <InstrumentSearch
                  instruments={instruments}
                  marketfeed={marketfeed}
                  addInstrumentToMarketfeed={addInstrumentToMarketfeed}/>
                <MarketDataView
                  instruments={instruments}
                  marketfeed={marketfeed}
                  selectInstrumentToMarketfeed={selectInstrumentToMarketfeed}
                  fetchInstrumentIntradayTimeSeries={fetchInstrumentIntradayTimeSeries}
                  fetchInstrumentDailyTimeSeries={fetchInstrumentDailyTimeSeries}
                  deleteInstrumentToMarketfeed={deleteInstrumentToMarketfeed} />
              </div>
          </div>
      )
}

const mapStateToProps = state => ({ ...state });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
       addInstrumentToMarketfeed,
       fetchInstruments,
       fetchInstrumentIntradayTimeSeries,
       fetchInstrumentDailyTimeSeries,
       selectInstrumentToMarketfeed,
       updateInstrumentToMarketfeed,
       deleteInstrumentToMarketfeed
    }, dispatch);

// The HOC
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopLayoutContainer);
