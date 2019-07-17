import React from "react";
import toJson from "enzyme-to-json";
import {shallow} from "enzyme";
import TradingDemo from "./TradingDemo";

/**
 * This is unit test of TradingDemo component
 * It leverage snapshot to test the presentation
 */

describe("TradingDemo", () => {

  it("should render component comparing with previous snapshot shallow markup", () => {
    // Given

    // When
    const component = shallow(<TradingDemo/>);

    // Then
    expect(toJson(component)).toMatchSnapshot();
  });

});
