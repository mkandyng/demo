import React from "react";
import Ticket from "../components/ticket/Ticket";
import InstrumentSearch from "../components/instrumentSearch/InstrumentSearch";
import Marketfeed from "../components/marketfeed/Marketfeed";
import BottomLayout from "../components/bottomLayout/BottomLayout"
import "./tradingDemo.css"

export default function TradingDemo(props) {
  return (
    <div>
      <div id="topLayout">
          <Ticket/>
          <div id="marketfeed">
            <InstrumentSearch />
            <Marketfeed />
          </div>
      </div>
      <BottomLayout />
    </div>
  )
};
