import React from "react";
import Ticket from "./Ticket";
import MarketData from "./MarketData";

const TopLayoutContainer = function(props) {
    return (
        <div id="topLayout">
            <Ticket/>
            <MarketData/>
        </div>
    )
}

export default TopLayoutContainer;
