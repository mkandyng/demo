import React from "react";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import { placeOrder, updateOrder } from "../../store/orderbook/orderbookActions"
import { fetchInstruments } from "../../store/instruments/instrumentsActions";
import { addInstrumentToMarketfeed,
         selectInstrumentToMarketfeed,
         updateInstrumentToMarketfeed,
         deleteInstrumentToMarketfeed } from "../../store/marketfeed/marketfeedActions";
import Ticket from "../../components/ticket/Ticket";
import InstrumentSearch from "../../components/instrumentSearch/InstrumentSearch";
import Marketfeed from "../../components/marketfeed/Marketfeed";
import "./topLayout.css"


/**
 * Container for the bottomLayout components
 */

function TopLayout(props) {
  return (
      <div id="topLayout">
          <Ticket {...props} />
          <div id="marketfeed">
            <InstrumentSearch {...props} />
            <Marketfeed {...props}/>
          </div>
      </div>
  )
}

const mapStateToProps = state => ({ instruments: state.instruments,
                                    instrument: state.marketfeed.selected,
                                    marketfeed: state.marketfeed,
                                  });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
      placeOrder,
      updateOrder,
      addInstrumentToMarketfeed,
      selectInstrumentToMarketfeed,
      updateInstrumentToMarketfeed,
      deleteInstrumentToMarketfeed,
      fetchInstruments,
    }, dispatch);

// The HOC
export default connect(mapStateToProps, mapDispatchToProps)(TopLayout);
