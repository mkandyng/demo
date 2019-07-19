import React from "react";
import toJson from "enzyme-to-json";
import {shallow} from "enzyme";
import Orderbook from "./Orderbook";

/**
 * This is unit test of Orderbook component
 * It leverage snapshot to test the presentation
 */

describe("Orderbook", () => {
  const props = {
    orders: [
      {
        orderRef: "XA12345678",
        symbol: "AMZ"
      }
    ]
  };

  it("should render component comparing with previous snapshot shallow markup", () => {
    // Given

    // When
    const component = shallow(<Orderbook orders={props.orders}/>);

    // Then
    expect(toJson(component)).toMatchSnapshot();
  });

});
