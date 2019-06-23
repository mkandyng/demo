import React from "react";
import {Line} from "recharts";
import TimeSeries from "../../../components/timeSeries/TimeSeries";

/**
 * Presentation component to display Intraday Time series
 */

export default function IntradayTimeSeries({ timeSeries }) {
    const childElements = [ <Line key="line1" type="monotone" dataKey="price" stroke="#8884d8" activeDot={{r: 8}}/> ]
    return (
        <TimeSeries timeSeries={timeSeries}
                    childElements={childElements}/>
    )
}
