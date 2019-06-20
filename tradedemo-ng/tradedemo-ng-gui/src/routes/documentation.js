import React from "react";

import TechnologiesView from "../components/documentation/Technologies";
import FunctionalitiesView from "../components/documentation/Functionalities";
import FutureDevelopmentView from "../components/documentation/FutureDevelopment";
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
