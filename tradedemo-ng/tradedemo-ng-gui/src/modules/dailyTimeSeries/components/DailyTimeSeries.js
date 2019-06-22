import React from "react";
import {connect} from "react-redux";
import {Line} from "recharts";
import TimeSeries from "../../../components/timeSeries/TimeSeries";

/**
 * Generic component to display timeSeries
 */

export function DailyTimeSeries({ timeSeries } ) {
    const childElements = [ <Line key="line1" type="monotone" dataKey="open" stroke="#8884d8" activeDot={{r: 8}}/>,
                            <Line key="line2" type="monotone" dataKey="close" stroke="#82ca9d"/> ]
    return (
        <TimeSeries timeSeries={timeSeries}
                    childElements={childElements}/>
    )
};

const mapStateToProps = state => ({timeSeries: state.dailyTimeSeries});

// The HOC
export default connect(mapStateToProps)(DailyTimeSeries);
