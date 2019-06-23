import React from "react";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import Ticket from "../../../modules/ticket/components";
import InstrumentSearch from "../../../modules/instruments/components";
import Marketfeed from "../../../modules/marketfeed/components";
import { fetchInstruments } from "../../../modules/instruments/actions";
import { placeOrder, updateOrder } from "../../../modules/orderbook/actions"
import { addInstrumentToMarketfeed,
         selectInstrumentToMarketfeed,
         updateInstrumentToMarketfeed,
         deleteInstrumentToMarketfeed } from "../../../modules/marketfeed/actions";
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

const mapStateToProps = state => ({ instruments: state.instruments,
                                    marketfeed: state.marketfeed,
                                    instrument: state.marketfeed.selected,
                                    ticket: state.ticket });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
      fetchInstruments,
      placeOrder,
      updateOrder,
      addInstrumentToMarketfeed,
      selectInstrumentToMarketfeed,
      updateInstrumentToMarketfeed,
      deleteInstrumentToMarketfeed,
      updateTicket
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UnWrapTopLayout);
