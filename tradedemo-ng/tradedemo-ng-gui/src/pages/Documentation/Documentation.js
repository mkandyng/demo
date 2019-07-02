import React from "react";

import TechnologiesView from "../../modules/documentation/Technologies";
import FunctionalitiesView from "../../modules/documentation/Functionalities";
import FutureDevelopmentView from "../../modules/documentation/FutureDevelopment";
import "./documentation.css";

/**
 * [Documentation component to display the documentation link]
 */
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
