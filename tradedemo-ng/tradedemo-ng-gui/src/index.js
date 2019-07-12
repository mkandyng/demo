import ReactDOM from "react-dom";
import "react-table/react-table.css";
import "react-tabs/style/react-tabs.css";
import "./index.css";
import { ajax } from 'rxjs/observable/dom/ajax';
import { rootEpic } from "./modules/rootEpic";
import { rootReducer} from "./modules/rootReducer";
import { createStoreWithMiddleware } from "./libs/utils";
import appWithProvider from "./pages/App";

const store = createStoreWithMiddleware(ajax, rootReducer, rootEpic);
const provider = appWithProvider(store);
ReactDOM.render(provider, document.getElementById("container"));
