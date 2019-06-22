import React from "react";
import {connect} from "react-redux";
import {Line} from "recharts";
import TimeSeries from "../../../components/timeSeries/TimeSeries";

/**
 * Generic component to display timeSeries
 */
export function IntradayTimeSeries({ timeSeries }) {
    const childElements = [ <Line key="line1" type="monotone" dataKey="price" stroke="#8884d8" activeDot={{r: 8}}/> ]
    return (
        <TimeSeries timeSeries={timeSeries}
                    childElements={childElements}/>
    )
};

const mapStateToProps = state => ({timeSeries: state.intradayTimeSeries});

// The HOC
export default connect(mapStateToProps)(IntradayTimeSeries);
