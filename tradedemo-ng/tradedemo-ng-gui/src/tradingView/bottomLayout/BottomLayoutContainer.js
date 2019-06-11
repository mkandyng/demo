import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import {selectBottomLayoutTab} from "../../store/actions/selectBottomLayoutTab";
import DailyPricesView from "./DailyPricesView";
import IntradayPricesView from "./IntradayPricesView";
import OrderBookView from "./OrderBookView";

/**
 * Container for the bottomLayout components
 */

const BottomLayoutContainer = function(props) {
  const { marketfeed,
          marketfeedInstruments,
          selectedMarketfeedIndex,
          selectedBottomLayoutTab,
          selectBottomLayoutTab,
          orderbook,
          intradayTimeSeries,
          dailyTimeSeries } = props;

  const selectedSymbol = marketfeed.selected !== undefined? marketfeed.selected.symbol:"";

  return (
    <div id="bottomLayout">
      <Tabs selectedIndex={selectedBottomLayoutTab}
            onSelect={tabIndex => selectBottomLayoutTab(tabIndex)}>
        <TabList>
          <Tab>Orderbook</Tab>
          <Tab>{"Intraday Prices " + selectedSymbol}</Tab>
          <Tab>{"Daily Prices " + selectedSymbol}</Tab>
        </TabList>
        <TabPanel><OrderBookView orderbook={orderbook}/></TabPanel>
        <TabPanel><IntradayPricesView timeSeries={intradayTimeSeries}/></TabPanel>
        <TabPanel><DailyPricesView timeSeries={dailyTimeSeries}/></TabPanel>
      </Tabs>
    </div>
  );
}

const mapStateToProps = state => ({
  ...state
});

// Map Redux actions to component props
const mapDispatchToProps = dispatch => bindActionCreators({
  selectBottomLayoutTab
}, dispatch);

// The HOC
export default connect(mapStateToProps, mapDispatchToProps)(BottomLayoutContainer);
