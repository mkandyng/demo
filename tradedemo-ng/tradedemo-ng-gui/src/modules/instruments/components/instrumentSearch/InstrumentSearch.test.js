import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
import InstrumentSearch from "./InstrumentSearch";

/**
 * This is unit test of InstrumentSearch component
 * It leverage snapshot to test the presentation
 */

describe("InstrumentSearch", () => {
  const props = { instruments: [{name:"symbol"}],
                  marketfeed: {instruments:[{symbol:"symbol"}], selected: {symbol:"symbol"}},
                  addInstrumentToMarketfeed: jest.fn(),
                  fetchInstruments: jest.fn()};

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<InstrumentSearch {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

});
