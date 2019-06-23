import React from "react";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import Ticket from "../../../modules/ticket/components";
import InstrumentSearch from "../../../modules/instruments/components/instrumentSearch";
import Marketfeed from "../../../modules/instruments/components/marketfeed";
import { placeOrder, updateOrder } from "../../../modules/orderbook/actions"
import { fetchInstruments,
         addInstrumentToMarketfeed,
         selectMarketfeedInstrument,
         updateMarketfeedInstrument,
         deleteMarketfeedInstrument } from "../../../modules/instruments/actions";
import { updateTicket } from "../../../modules/ticket/actions";
import "./topLayout.css"


/**
 * Container for the bottomLayout components
 */

export function TopLayout(props) {
  return (
      <div id="topLayout">
          <Ticket {...props} />
          <div id="marketfeed">
            <InstrumentSearch {...props} />
            <Marketfeed {...props} />
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
