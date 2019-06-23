import React from "react";
import {Line} from "recharts";
import TimeSeries from "../../../components/timeSeries/TimeSeries";

/**
 * Presentation component to display Daily Time series
 */

export default function DailyTimeSeries({ timeSeries } ) {
    const childElements = [ <Line key="line1" type="monotone" dataKey="open" stroke="#8884d8" activeDot={{r: 8}}/>,
                            <Line key="line2" type="monotone" dataKey="close" stroke="#82ca9d"/> ]
    return (
        <TimeSeries timeSeries={timeSeries}
                    childElements={childElements}/>
    )
}
