import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { Provider } from "react-redux";
import { rootReducer } from "./store/reducers/root";
import { rootEpic } from "./store/epics";
import App from "./components/App";
import "react-table/react-table.css";
import "react-tabs/style/react-tabs.css";
import "./index.css";

const epicMiddleware = createEpicMiddleware();

const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

epicMiddleware.run(rootEpic);

const appWithProvider = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(appWithProvider, document.getElementById("container"));
