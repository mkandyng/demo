import React from "react";

import Technologies from "./Technologies";
import Functionalities from "./Functionalities";
import FutureDevelopment from "./FutureDevelopment";

function DocumentationContainer(props) {
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

export default DocumentationContainer;
