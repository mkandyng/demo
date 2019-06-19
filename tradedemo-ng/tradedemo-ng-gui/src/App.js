import React from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import TradingDemo from "./routes/tradingDemo";
import Documentation from "./routes/documentation";

export default function Apps() {
    return (
       <HashRouter>
         <div>
           <ul className="header">
             <li><NavLink exact to="/">Trading Demo</NavLink></li>
             <li><NavLink to="/documentation">Documentation</NavLink></li>
           </ul>
           <div className="content">
               <Route exact path="/" component={TradingDemo}/>
               <Route path="/Documentation" component={Documentation}/>
           </div>
         </div>
      </HashRouter>
    )
}
