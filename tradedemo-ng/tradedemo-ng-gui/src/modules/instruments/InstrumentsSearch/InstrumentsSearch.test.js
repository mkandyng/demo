import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
import InstrumentsSearch from "./InstrumentsSearch";

/**
 * This is unit test of InstrumentsSearch component
 * It leverage snapshot to test the presentation
 */

describe("InstrumentsSearch", () => {
  const props = { instruments: [{name:"symbol"}],
                  marketfeed: {instruments:[{symbol:"symbol"}], selected: {symbol:"symbol"}},
                  addInstrumentToMarketfeed: jest.fn(),
                  fetchInstruments: jest.fn()};

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<InstrumentsSearch {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

});
