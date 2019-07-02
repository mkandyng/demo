import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { Provider } from "react-redux";
import {rootEpic} from "./app/combinedEpics";
import combinedReducers from "./app/combinedReducers";
import "react-table/react-table.css";
import "react-tabs/style/react-tabs.css";
import "./index.css";
import App from "./app/App";

/**
 * Application main, wiring up Redux store, Redux-observable
 */
const epicMiddleware = createEpicMiddleware();
const store = createStore(combinedReducers, applyMiddleware(epicMiddleware));
epicMiddleware.run(rootEpic);

const appWithProvider = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(appWithProvider, document.getElementById("container"));
