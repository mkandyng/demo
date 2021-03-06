import React from "react";
import toJson from "enzyme-to-json";
import {shallow} from "enzyme";
import {BottomLayout} from "./BottomLayout";

/**
 * This is unit test of Orderbook component
 * It leverage snapshot to test the presentation
 */

describe("BottomLayout", () => {
  const props = {
    symbol: "symbol",
    orders: [
      {
        symbol: "symbol"
      }
    ],
    intradayTimeSeries: {},
    dailyTimeSeries: {},
    fetchIntradayTimeSeries: jest.fn(),
    fetchDailyTimeSeries: jest.fn()
  };

  it("should render component comparing with previous snapshot shallow markup", () => {
    // Given

    // When
    const component = shallow(<BottomLayout {...props}/>);

    // Then
    expect(toJson(component)).toMatchSnapshot();
  });

});
