import React from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import TradingViewContainer from "./tradingView/TradingViewContainer";
import DocumentationContainer from "./documentation/DocumentationContainer";

const App = function(props) {
    return (
	<HashRouter>
            <div>
                <ul className="header">
                    <li><NavLink exact to="/">Trading View</NavLink></li>
                    <li><NavLink to="/documentation">Documentation</NavLink></li>
                </ul>
                <div className="content">
		    <Route exact path="/" component={TradingViewContainer}/>
		    <Route path="/Documentation" component={DocumentationContainer}/>
                </div>
            </div>
	</HashRouter>
    )
};

export default App;
