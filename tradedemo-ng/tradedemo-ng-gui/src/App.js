import React from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import TradingView from "./tradingView";
import Documentation from "./documentation";

export default function Apps() {
    return (
       <HashRouter>
         <div>
           <ul className="header">
             <li><NavLink exact to="/">Trading View</NavLink></li>
             <li><NavLink to="/documentation">Documentation</NavLink></li>
           </ul>
           <div className="content">
               <Route exact path="/" component={TradingView}/>
               <Route path="/Documentation" component={Documentation}/>
           </div>
         </div>
      </HashRouter>
    )
}
