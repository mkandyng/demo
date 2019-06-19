import React from "react";
import {LineChart,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        ResponsiveContainer,
        Legend } from "recharts";

import "./timeSeries.css";

/**
 * Generic component to display timeSeries
 */
export default function TimeSeriesView({ timeSeries }) {
    const margin = {top: 5, right: 20, left: 0, bottom: 5};
    return (
      <div className="timeSeriesPrices">
         <ResponsiveContainer>
            <LineChart
                        data={timeSeries.data.chartData}
                        margin={margin}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis interval="preserveStartEnd"
                               domain={[timeSeries.data.minValue, timeSeries.data.maxValue]} />
                        <Tooltip />
                        <Legend />
                        {timeSeries.childElements}
            </LineChart>
         </ResponsiveContainer>
      </div>
   )
};
