import React from "react";
import {LineChart,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        ResponsiveContainer,
        Legend } from "recharts";

export const getDateString = function (date, format) {
    const dateTimeMills = date.toISOString();
    if(format === "dateOnly") {
       return dateTimeMills.substr(0,10);
    } else if(format === "dateTimeFormat") {
       return dateTimeMills.replace("T"," ").replace("Z","");
    }
};

export const toggleOpacity = function (selectedValue, opacityValue, equalsCompare) {
    if(equalsCompare) {
        return selectedValue === opacityValue? "0.5": "1.0";
    } else {
        return selectedValue === opacityValue? "1.0": "0.5";
    }
};

export const getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const TimeSeries = function (props) {
    return (
      <div className="timeSeriesPrices">
         <ResponsiveContainer>
            <LineChart
                        data={props.timeSeries.chartData}
                        margin={{top: 5, right: 20, left: 0, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis interval="preserveStartEnd"
                               domain={[props.timeSeries.minValue, props.timeSeries.maxValue]} />
                        <Tooltip />
                        <Legend />
                        {props.childElements}
            </LineChart>
         </ResponsiveContainer>
       </div>
    )
};
