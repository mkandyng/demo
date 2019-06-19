import React from "react";

import TechnologiesView from "../components/documentation/TechnologiesView";
import FunctionalitiesView from "../components/documentation/FunctionalitiesView";
import FutureDevelopmentView from "../components/documentation/FutureDevelopmentView";
import "./documentation.css";

export default function Documentation() {
  return (
    <div id="documentation">
      <div style={{padding: "20px"}}>
        <h3>TradeDemo-NG</h3>
        <hr/>
        <TechnologiesView/>
        <FunctionalitiesView/>
        <FutureDevelopmentView/>
      </div>
    </div>
  );
}
