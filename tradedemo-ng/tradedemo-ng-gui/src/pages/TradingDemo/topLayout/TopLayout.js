import React from "react";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import Ticket from "../../../modules/ticket/Ticket";
import InstrumentsSearch from "../../../modules/instruments/InstrumentsSearch";
import InstrumentsMarketfeed from "../../../modules/instruments/InstrumentsMarketfeed";
import { placeOrder,
         updateOrder } from "../../../modules/orderbook/store/orderbookActions"
import { addInstrumentToMarketfeed,
         selectMarketfeedInstrument,
         updateMarketfeedInstrument,
         deleteMarketfeedInstrument } from "../../../modules/instruments/store/instrumentsActions";
import "./topLayout.css"


/**
 * Container for the bottomLayout components
 */

export function TopLayout(props) {
    return (
        <div id="topLayout">
            <Ticket {...props} enableDemo={true} />
            <div id="instrumentsMarketfeed">
                <InstrumentsSearch {...props} />
                <InstrumentsMarketfeed {...props} />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({ searchInstruments: state.instruments.searchInstruments,
                                    marketfeedInstruments: state.instruments.marketfeedInstruments,
                                    instrument: state.instruments.selected });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
      placeOrder,
      updateOrder,
      addInstrumentToMarketfeed,
      selectMarketfeedInstrument,
      updateMarketfeedInstrument,
      deleteMarketfeedInstrument,
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TopLayout);
