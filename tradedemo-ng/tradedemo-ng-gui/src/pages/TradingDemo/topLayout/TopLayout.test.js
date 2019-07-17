import React from "react";
import toJson from "enzyme-to-json";
import {shallow} from "enzyme";
import {TopLayout} from "./TopLayout";

/**
 * This is unit test of TopLayout component
 * It leverage snapshot to test the presentation
 */

describe("TopLayout", () => {
  const props = {
    searchInstruments: [
      {
        symbol: "symbol"
      }
    ],
    marketfeedInstruments: [
      {
        symbol: "symbol"
      }
    ],
    ticket: {
      symbol: "symbol"
    },
    instrument: {
      symbol: "symbol"
    },
    fetchInstruments: jest.fn(),
    placeOrder: jest.fn(),
    updateOrder: jest.fn(),
    addInstrumentToMarketfeed: jest.fn(),
    selectMarketfeedInstrument: jest.fn(),
    updateMarketfeedInstrument: jest.fn(),
    deleteMarketfeedInstrument: jest.fn()
  }

  it("should render component comparing with previous snapshot shallow markup", () => {
    // Given

    // When
    const component = shallow(<TopLayout {...props}/>);

    // Then
    expect(toJson(component)).toMatchSnapshot();
  });

});
