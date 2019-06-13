import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { Provider } from "react-redux";
import { combinedEpics } from "./store/combinedEpics";
import combinedReducers from "./store/combinedReducers";
import App from "./App";
import "react-table/react-table.css";
import "react-tabs/style/react-tabs.css";
import "./index.css";

/**
 * Application main, wiring up Redux store, Redux-observable
 */
const epicMiddleware = createEpicMiddleware();
const store = createStore(combinedReducers, applyMiddleware(epicMiddleware));
epicMiddleware.run(combinedEpics);

const appWithProvider = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(appWithProvider, document.getElementById("container"));
