import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import {fetchIntradayTimeSeries} from "../../store/intradayTimeSeries/intradayTimeSeriesActions";
import {fetchDailyTimeSeries} from "../../store/dailyTimeSeries/dailyTimeSeriesActions";
import BottomLayoutView from "./BottomLayoutView";

/**
 * Container for the bottomLayout components
 */

function BottomLayout(props) {
    const INTRADAY_TIMESERIES_TAB_INDEX = 1;
    const DAILY_TIME_SERIES_TAB_INDEX = 2;

    const { symbol,
            fetchIntradayTimeSeries,
            fetchDailyTimeSeries } = props;

    const [ selectedSymbol, updateSelectedSymbol ] = useState("");
    const [ selectedTab, updateSelectedTab ] = useState(0);

    useEffect(() => {
        updateSelectedSymbol(symbol);
        if(selectedTab === INTRADAY_TIMESERIES_TAB_INDEX) {
            fetchIntradayTimeSeries(symbol);
        } else if(selectedTab === DAILY_TIME_SERIES_TAB_INDEX) {
            fetchDailyTimeSeries(symbol);
        }
    },[symbol, selectedTab, fetchIntradayTimeSeries, fetchDailyTimeSeries])

    return (
        <BottomLayoutView symbol={selectedSymbol}
                          selectedTab={selectedTab}
                          updateSelectedTab={updateSelectedTab} />
    );
}

const mapStateToProps = state => ({symbol: state.marketfeed.selected.symbol});

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
      fetchIntradayTimeSeries,
      fetchDailyTimeSeries
    }, dispatch);

// The HOC
export default connect(mapStateToProps, mapDispatchToProps)(BottomLayout);
