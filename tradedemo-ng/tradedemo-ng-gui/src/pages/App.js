import React from "react";
import {Provider} from "react-redux";
import {Route, NavLink, HashRouter} from "react-router-dom";
import TradingDemo from "./TradingDemo";
import Documentation from "./Documentation";
import {getRandomInt} from "../libs/utils";
import {fetchInstruments, updateMarketfeedInstrument} from "../modules/instruments/store/instrumentsActions";
import {flashPriceUpdate} from "../modules/instruments/instruments";

export default function appWithProvider(store) {
  initOnStartup(store);
  return (<Provider store={store}>
    <App/>
  </Provider>)
};

function initOnStartup(store) {
  store.dispatch(fetchInstruments());
  setInterval(() => {
    if (store.getState().instruments && store.getState().instruments.selected.symbol !== undefined) {
      flashPriceUpdate(store.getState().instruments.marketfeedInstruments, instrument => store.dispatch(updateMarketfeedInstrument(instrument)));
    }
  }, getRandomInt(200, 500));
}

/**
 * [Apps Application Main defining routes, separating between header and content]
 */
function App() {
  return (<HashRouter>
    <div>
      <ul className="header">
        <li>
          <NavLink exact={true} to="/">Trading Demo</NavLink>
        </li>
        <li>
          <NavLink to="/documentation">Documentation</NavLink>
        </li>
      </ul>
      <div className="content">
        <Route exact={true} path="/" component={TradingDemo}/>
        <Route path="/Documentation" component={Documentation}/>
      </div>
    </div>
  </HashRouter>)
}
