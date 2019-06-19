import React from "react";
import { connect } from "react-redux";
import {Line} from "recharts";
import TimeSeriesView from "./TimeSeriesView";

/**
 * Component to display IntradayPrices
 */
function IntradayPrices(props) {
    const { timeSeries } = props;

    const margin = {top: 5, right: 20, left: 0, bottom: 5};
    const childElements = (<Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{r: 8}}/>);
    return (
        <TimeSeriesView
            timeSeries={timeSeries}
            margin={margin}
            childElements={childElements}
        />
    )
}

const mapStateToProps = state => ({timeSeries: state.intradayTimeSeries});

// The HOC
export default connect(
    mapStateToProps
)(IntradayPrices);
