import React from "react";
import {LineChart,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        ResponsiveContainer,
        Legend } from "recharts";

/**
 * Generic component to display timeSeries
 */
export default function TimeSeries(props) {
    const { timeSeries,  margin, childElements } = props;
    return (
      <div className="timeSeriesPrices">
         <ResponsiveContainer>
            <LineChart
                        data={timeSeries.chartData}
                        margin={margin}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis interval="preserveStartEnd"
                               domain={[timeSeries.minValue, timeSeries.maxValue]} />
                        <Tooltip />
                        <Legend />
                        {childElements}
            </LineChart>
         </ResponsiveContainer>
      </div>
   )
};
