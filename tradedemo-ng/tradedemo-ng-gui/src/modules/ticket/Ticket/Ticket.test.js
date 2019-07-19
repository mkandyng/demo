import React from "react";
import toJson from "enzyme-to-json";
import {shallow} from "enzyme";
import Ticket from "./Ticket";

/**
 * This is unit test of Orderbook component
 * It leverage snapshot to test the presentation
 */

describe("Ticket", () => {
  const instrument = {
    symbol: "symbol",
    quantity: 5
  };
  const props = {
    enableDemo: false,
    instrument: instrument,
    placeOrder: jest.fn(),
    updateOrder: jest.fn(),
  };

  it("should render component comparing with previous snapshot shallow markup", () => {
    // Given

    // When
    const component = shallow(<Ticket {...props}/>);

    // Then
    expect(toJson(component)).toMatchSnapshot();
  });
});
