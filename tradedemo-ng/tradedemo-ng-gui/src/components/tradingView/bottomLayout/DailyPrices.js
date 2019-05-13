import React from "react";
import { Line } from "recharts";
import { TimeSeries } from "../../../libs/utils";

const DailyPrices = function(props) {
	const childElements = () => {
		let childElements = [];
		childElements.push(<Line type="monotone" dataKey="open" stroke="#8884d8" activeDot={{ r: 8 }} />);
		childElements.push(<Line type="monotone" dataKey="close" stroke="#82ca9d"/>);
		return childElements;
	};

    	return (
		<TimeSeries timeSeries={props.timeSeries} childElements={childElements()} />
    	) 
};

export default DailyPrices;
