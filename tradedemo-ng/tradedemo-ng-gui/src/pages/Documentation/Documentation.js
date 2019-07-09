import React from "react";

import Technologies from "../../modules/documentation/Technologies";
import Functionalities from "../../modules/documentation/Functionalities";
import FutureDevelopment from "../../modules/documentation/FutureDevelopment";
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
              <Technologies/>
              <Functionalities/>
              <FutureDevelopment/>
          </div>
      </div>
  );
}
