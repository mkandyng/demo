import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import OrderBlotter from "./OrderBlotter";
import IntradayPrices from "./IntradayPrices";
import DailyPrices from "./DailyPrices";
import { selectBottomLayoutTab } from "../../../store/actions/selectBottomLayoutTab";

const BottomLayout = function(props) {
    let selectedSymbol = "";
    if(props.marketfeedInstruments.length > 0) {
	selectedSymbol = " [" + props.marketfeedInstruments[props.selectedMarketfeedIndex].symbol + "]";
    }

    return (
        <div id="bottomLayout">
	    <Tabs selectedIndex={props.selectedBottomLayoutTab}  
	          onSelect={tabIndex => props.selectBottomLayoutTab(tabIndex)}>
                <TabList>
            	    <Tab>Order Blotter</Tab>
            	    <Tab>{"Intraday Prices" + selectedSymbol}</Tab>
            	    <Tab>{"Daily Prices" + selectedSymbol}</Tab>
    	    	</TabList>
	    	<TabPanel>
		    <OrderBlotter orderbook={props.orderbook}/>
	   	</TabPanel>
           	<TabPanel>
		    <IntradayPrices timeSeries={props.intradayTimeSeries}/>
	   	</TabPanel>
           	<TabPanel>
		    <DailyPrices timeSeries={props.dailyTimeSeries}/>
	   	</TabPanel>
	   </Tabs>
      </div>
    );
}

const mapStateToProps = state => ({ ...state });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
        selectBottomLayoutTab
    }, dispatch);

// The HOC
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomLayout);
