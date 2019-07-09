import React, { useState, useEffect } from "react";
import {connect} from "react-redux";
import SelectableTabs from "../../../components/SelectableTabs"
import Orderbook from "../../../modules/orderbook/Orderbook";
import TimeSeries, { TimeSeriesLines } from "../../../modules/timeSeries/TimeSeries";
import "./bottomLayout.css";

/**
 * Container for the bottomLayout components
 */
export function BottomLayout(props) {

    const { symbol,
            orders,
            intradayTimeSeries,
            dailyTimeSeries } = props

    const [ selectedSymbol, updateSelectedSymbol ] = useState("");
    const [ selectedTab, updateSelectedTab ] = useState(0);

    useEffect(() => {
        updateSelectedSymbol(symbol);
    },[symbol])

    const tabs = [
        { name: "Orderbook",
          panel: <Orderbook orders={orders} />},
        { name: "Intraday Prices " + selectedSymbol,
          panel: <TimeSeries timeSeries={intradayTimeSeries} childElements={TimeSeriesLines.INTRADAY_LINES}/>},
        { name: "Daily Prices " + selectedSymbol,
          panel: <TimeSeries timeSeries={dailyTimeSeries} childElements={TimeSeriesLines.DAILY_LINES}/>},
    ]

    return (
        <SelectableTabs containerId="bottomLayout"
                        selectedTab={selectedTab}
                        updateSelectedTab={updateSelectedTab}
                        tabs={tabs} />
    );
}

const mapStateToProps = state => (
                        { symbol: state.instruments.selected === undefined?"":state.instruments.selected.symbol,
                          orders: state.orderbook,
                          intradayTimeSeries: state.timeSeries.intradayTimeSeries,
                          dailyTimeSeries: state.timeSeries.dailyTimeSeries });

// The HOC
export default connect(mapStateToProps)(BottomLayout);
