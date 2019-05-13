import React from "react";
import { Line } from "recharts";
import { TimeSeries } from "../../../libs/utils";

const IntradayPrices = function(props) {
	const childElements = (
		<Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
	);
        return (
		<TimeSeries timeSeries={props.timeSeries} childElements={childElements} />
        ) 
};

export default IntradayPrices
