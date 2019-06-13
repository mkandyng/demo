import React from "react";

import TechnologiesView from "./TechnologiesView";
import FunctionalitiesView from "./FunctionalitiesView";
import FutureDevelopmentView from "./FutureDevelopmentView";

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
