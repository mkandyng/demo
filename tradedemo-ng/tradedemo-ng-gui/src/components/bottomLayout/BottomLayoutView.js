import React from "react";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import Orderbook from "../orderbook/Orderbook";
import TimeSeriesView from "../timeSeries/TimeSeriesView";
import "./bottomLayout.css";

export default function BottomLayoutView(props) {
    const { symbol,
            orderbook,
            intradayTimeSeries,
            dailyTimeSeries,
            selectedTab,
            updateSelectedTab } = props;
    return (
        <div id="bottomLayout">
            <Tabs selectedIndex={selectedTab}
                  onSelect={tabIndex => updateSelectedTab(tabIndex)}>
                <TabList>
                  <Tab>Orderbook</Tab>
                  <Tab>{"Intraday Prices " + symbol}</Tab>
                  <Tab>{"Daily Prices " + symbol}</Tab>
                </TabList>
                <TabPanel><Orderbook orderbook={orderbook}/></TabPanel>
                <TabPanel><TimeSeriesView timeSeries={intradayTimeSeries}/></TabPanel>
                <TabPanel><TimeSeriesView timeSeries={dailyTimeSeries}/></TabPanel>
            </Tabs>
        </div>
    );
}
