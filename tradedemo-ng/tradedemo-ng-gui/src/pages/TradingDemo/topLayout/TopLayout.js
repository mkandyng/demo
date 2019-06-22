import React from "react";
import Ticket from "../../../modules/ticket/components";
import InstrumentSearch from "../../../modules/instruments/components";
import Marketfeed from "../../../modules/marketfeed/components";
import "./topLayout.css"


/**
 * Container for the bottomLayout components
 */

export default function TopLayout(props) {
  return (
      <div id="topLayout">
          <Ticket />
          <div id="marketfeed">
            <InstrumentSearch />
            <Marketfeed/>
          </div>
      </div>
  )
}
