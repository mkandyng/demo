import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getRandomInt } from "../../common/libs/utils";
import { generateMarketDataMovement } from "../../common/libs/marketfeed";
import Ticket from "./TicketView";
import InstrumentSearch from "./InstrumentSearchView";
import MarketDataView from "./MarketDataView";
import { fetchInstruments } from "../../store/instruments/instrumentsActions";
import { addInstrumentToMarketfeed,
         selectInstrumentToMarketfeed,
         updateInstrumentToMarketfeed,
         deleteInstrumentToMarketfeed } from "../../store/marketfeed/marketfeedActions";
/**
 * TopLayout root container component
 */

const TopLayoutContainer = function(props) {
  const { instruments,
          marketfeed,
          fetchInstruments,
          addInstrumentToMarketfeed,
          deleteInstrumentToMarketfeed,
          selectInstrumentToMarketfeed} = props;

   const flashPriceUpdate = (marketfeedInstruments) => {
        const flashCount = 2;
        const instrumentIndex = getRandomInt(0, marketfeedInstruments.length);
        const randomInstrument = marketfeedInstruments[instrumentIndex];
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
                    props.updateInstrumentToMarketfeed(instrumentPrice);
                }, 500);
            }
        }
  };

  const [ flashCounter, flashPrice ] = useState(0);

  useEffect( () => {
      fetchInstruments();
  }, [fetchInstruments]);

  useEffect( () => {
      setTimeout(() => flashPrice(flashCounter+1), getRandomInt(1000,3000));
      flashPriceUpdate(marketfeed.instruments);
  }, [flashCounter]);

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
       selectInstrumentToMarketfeed,
       updateInstrumentToMarketfeed,
       deleteInstrumentToMarketfeed
    }, dispatch);

// The HOC
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopLayoutContainer);
