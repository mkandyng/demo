import React from "react";
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

/**
 * Generic component to display timeSeries
 */
export default function TimeSeries({timeSeries, childElements}) {
  const margin = {
    top: 5,
    right: 20,
    left: 0,
    bottom: 5
  };
  return (<div className="timeSeriesPrices">
    <ResponsiveContainer>
      <LineChart data={timeSeries.chartData} margin={margin}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis interval="preserveStartEnd" domain={[timeSeries.minValue, timeSeries.maxValue]}/>
        <Tooltip/>
        <Legend/> {childElements}
      </LineChart>
    </ResponsiveContainer>
  </div>)
}

export const TimeSeriesLines = {
  INTRADAY_LINES: [<Line key="line1"
                         type="monotone"
                         dataKey="price"
                         stroke="#8884d8"
                         activeDot={{r: 8}}/>],
  DAILY_LINES: [
    <Line key="line1"
          type="monotone"
          dataKey="open"
          stroke="#8884d8"
          activeDot={{r: 5}}/>,
    <Line key="line2"
          type="monotone"
          dataKey="close"
          stroke="#82ca9d"
          activeDot={{r: 5}}/>
  ]
}

TimeSeries.propTypes = {
  timeSeries: PropTypes.object.isRequired,
  childElements: PropTypes.arrayOf(PropTypes.object).isRequired
};
