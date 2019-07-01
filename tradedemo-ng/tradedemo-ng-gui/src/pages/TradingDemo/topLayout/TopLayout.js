import React from "react";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import Ticket from "../../../modules/ticket/Ticket";
import InstrumentsSearch from "../../../modules/instruments/InstrumentsSearch";
import InstrumentsMarketfeed from "../../../modules/instruments/InstrumentsMarketfeed";
import { placeOrder, updateOrder } from "../../../modules/orderbook/orderbookActions"
import { fetchInstruments,
         addInstrumentToMarketfeed,
         selectMarketfeedInstrument,
         updateMarketfeedInstrument,
         deleteMarketfeedInstrument } from "../../../modules/instruments/instrumentsActions";
import { updateTicket } from "../../../modules/ticket/ticketActions";
import "./topLayout.css"


/**
 * Container for the bottomLayout components
 */

export function TopLayout(props) {
    return (
        <div id="topLayout">
            <Ticket {...props} />
            <div id="instrumentsMarketfeed">
                <InstrumentsSearch {...props} />
                <InstrumentsMarketfeed {...props} />
            </div>
        </div>
    )
}

export const UnWrapTopLayout = TopLayout;

const mapStateToProps = state => ({ instruments: state.instruments.instruments,
                                    marketfeedInstruments: state.instruments.marketfeedInstruments,
                                    instrument: state.instruments.selected,
                                    ticket: state.ticket });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
      fetchInstruments,
      placeOrder,
      updateOrder,
      addInstrumentToMarketfeed,
      selectMarketfeedInstrument,
      updateMarketfeedInstrument,
      deleteMarketfeedInstrument,
      updateTicket
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UnWrapTopLayout);
