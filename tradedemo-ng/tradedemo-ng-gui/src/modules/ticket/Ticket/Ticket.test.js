import React from "react";
import toJson from "enzyme-to-json";
import {shallow} from "enzyme";
import Ticket, {TicketView} from "./Ticket";

/**
 * This is unit test of Orderbook component
 * It leverage snapshot to test the presentation
 */

describe("Ticket", () => {
  const ticket = {
    symbol: "symbol",
    quantity: 5,
    orderType: "Market",
    price: 0,
    expiryType: "Day",
    expiryDate: "2019-10-12",
    note: ""
  };
  const props = {
    ticket: ticket,
    instrument: ticket,
    placeOrder: jest.fn(),
    updateOrder: jest.fn(),
    updateTicket: jest.fn()
  };

  it("should render component comparing with previous snapshot shallow markup", () => {
    // Given

    // When
    const component = shallow(<Ticket {...props}/>);

    // Then
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render TicketView component comparing with previous snapshot shallow markup", () => {
    // Given
    const localProps = {
      ticket: ticket,
      instrument: ticket,
      eventHandler: {
        handleFormChange: jest.fn(),
        orderTypeChange: jest.fn(),
        expiryTypeChange: jest.fn(),
        handleOnSubmit: jest.fn()
      }
    };

    // When
    const component = shallow(<TicketView {...localProps}/>);

    // Then
    expect(toJson(component)).toMatchSnapshot();
  });

});
