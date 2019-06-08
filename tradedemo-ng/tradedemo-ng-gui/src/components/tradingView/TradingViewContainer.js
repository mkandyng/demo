import React from "react";
import TopLayoutContainer from "./topLayout/TopLayoutContainer";
import BottomLayoutContainer from "./bottomLayout/BottomLayoutContainer";

const TradingViewContainer = function(props) {
  return (
    <div>
      <TopLayoutContainer />
      <BottomLayoutContainer />
    </div>
  )
};

export default TradingViewContainer;
