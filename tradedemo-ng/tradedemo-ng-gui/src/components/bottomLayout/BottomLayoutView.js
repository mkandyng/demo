import React from "react";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import DailyPrices from "../timeSeries/DailyPrices";
import IntradayPrices from "../timeSeries/IntradayPrices";
import Orderbook from "../orderbook/Orderbook";
import "./bottomLayout.css";

export default function BottomLayoutView({symbol, selectedTab, updateSelectedTab}) {

    return (
        <div id="bottomLayout">
            <Tabs selectedIndex={selectedTab}
                  onSelect={tabIndex => updateSelectedTab(tabIndex)}>
                <TabList>
                  <Tab>Orderbook</Tab>
                  <Tab>{"Intraday Prices " + symbol}</Tab>
                  <Tab>{"Daily Prices " + symbol}</Tab>
                </TabList>
                <TabPanel><Orderbook/></TabPanel>
                <TabPanel><IntradayPrices/></TabPanel>
                <TabPanel><DailyPrices/></TabPanel>
            </Tabs>
        </div>
    );
}
