import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import SelectableTabs from "../../../components/selectableTabs/SelectableTabs"
import Orderbook from "../../../modules/orderbook/components";
import DailyTimeSeries from "../../../modules/dailyTimeSeries/components";
import IntradayTimeSeries from "../../../modules/intradayTimeSeries/components";
import "./bottomLayout.css";

/**
 * Container for the bottomLayout components
 */
export function BottomLayout({ symbol }) {

    const [ selectedSymbol, updateSelectedSymbol ] = useState("");
    const [ selectedTab, updateSelectedTab ] = useState(0);

    useEffect(() => {
        updateSelectedSymbol(symbol);
    },[symbol])

    const tabs = [
        { name: "Orderbook",
          panel: <Orderbook/>},
        { name: "Intraday Prices " + selectedSymbol,
          panel: <IntradayTimeSeries/>},
        { name: "Daily Prices " + selectedSymbol,
          panel: <DailyTimeSeries/>},
    ]

    return (
          <SelectableTabs containerId="bottomLayout"
                          selectedTab={selectedTab}
                          updateSelectedTab={updateSelectedTab}
                          tabs={tabs} />
    );
}

const mapStateToProps = state => (
                        { symbol: state.marketfeed.selected.symbol
                         });

// The HOC
export default connect(mapStateToProps)(BottomLayout);
