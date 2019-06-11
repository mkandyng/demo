import React from "react";
import {Line} from "recharts";
import TimeSeries from "../../common/components/TimeSeries";

/**
 * Component to display IntradayPrices
 */
export default function IntradayPricesView({ timeSeries }) {
  const margin = {top: 5, right: 20, left: 0, bottom: 5};
  const childElements = (<Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{r: 8}}/>);
  return (
    <TimeSeries
      timeSeries={timeSeries}
      margin={margin}
      childElements={childElements}
    />
  )
}
