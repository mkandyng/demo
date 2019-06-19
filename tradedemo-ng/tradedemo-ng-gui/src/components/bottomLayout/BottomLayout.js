import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import {Line} from "recharts";
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
            orderbook,
            intradayTimeSeries,
            dailyTimeSeries,
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
                          orderbook={orderbook}
                          intradayTimeSeries={intradayTimeSeries}
                          dailyTimeSeries={dailyTimeSeries}
                          selectedTab={selectedTab}
                          updateSelectedTab={updateSelectedTab} />
    );
}

const mapStateToProps = state => (
                        { symbol: state.marketfeed.selected.symbol,
                          orderbook: state.orderbook,
                          intradayTimeSeries: {
                              data: state.intradayTimeSeries,
                              childElements: <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{r: 8}}/>
                          },
                          dailyTimeSeries: {
                              data: state.dailyTimeSeries,
                              childElements: [ <Line type="monotone" dataKey="open" stroke="#8884d8" activeDot={{r: 8}}/>,
                                               <Line type="monotone" dataKey="close" stroke="#82ca9d"/>]
                          }
                         });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
      fetchIntradayTimeSeries,
      fetchDailyTimeSeries
    }, dispatch);

// The HOC
export default connect(mapStateToProps, mapDispatchToProps)(BottomLayout);
