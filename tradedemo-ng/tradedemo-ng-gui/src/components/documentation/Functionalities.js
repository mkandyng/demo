import React from "react";

function Functionalities(props) {
    return (
	<div>
	    <p>
 	        This skeleton trading system provided the following functionalities:
	    </p>
	    <ul>
	        <li>Rest API to fetch real (delay) stock market instruments and market data from <a href="https://www.alphavantage.co/" alt="alpavantage">Alpha Vantage</a>.</li> 
	        <li>Pre populate a number of instruments to the market feed.</li>
	        <li>Simulation of price movements on instruments.</li>
	        <li>Allow users to add and delete instruments from market feed</li>
	        <li>Context sensitive search to find tradeable instruments to add to maket feed.</li>	
	        <li>Select an instrument from market feed to trade and display in order blotter.</li>	
	        <li>Simulation of order life cycle of trade events in order blotter.</li>	
	        <li>Charts showing Intraday and previous open/close prices.</li>
	    </ul>
	</div>
    );
}

export default Functionalities;
