import React from "react";
import toJson from "enzyme-to-json";
import { shallow, mount } from "enzyme";
import InstrumentsSearch from "./InstrumentsSearch";
import { MAX_MARKET_FEED_INSTRUMENTS,
         MAX_INSTRUMENTS } from "../instruments";
import { addInstrumentToMarketfeedVerify,
         createInstruments } from "../instruments.test.helpers";

/**
 * Unit Test InstrumentSearch, using snapshot and simulate even callback
 */

describe("InstrumentsSearch", () => {
    let props = undefined;
    let component = undefined;

    beforeEach(() => {
        props = { searchInstruments: [{symbol: "sym", name:"symbol"}],
                  marketfeedInstruments: [{symbol: "sym1", name:"symbol1"}],
                  addInstrumentToMarketfeed: jest.fn() };
        component = mount(<InstrumentsSearch {...props} />);
    });

    it("should render component comparing with previous snapshot shallow markup", () => {
        component = shallow(<InstrumentsSearch {...props} />);
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should update value on input change", () => {

      
        // Given
        const expectedValue = "changeValue";
        // When
        component.find("input").find({role: "combobox"})
             .simulate("change", {target: {value: expectedValue}});

        // Then
        expect(component.find("input").find({value: expectedValue}).props().value)
                                      .toEqual(expectedValue);
    });

    it("should reject input not in instruments", () => {
        addInstrumentToMarketfeedVerify("invalid",
                                        props,
                                        () => expect(window.alert)
                                        .toHaveBeenCalledWith(expect.stringMatching(/not valid/)));
    });

    it("should reject when marketInstruments exceed max", () => {
        addInstrumentToMarketfeedVerify(props.searchInstruments[0].symbol,
                                        { ...props,
                                          marketfeedInstruments: createInstruments(MAX_MARKET_FEED_INSTRUMENTS)},
                                        () => expect(window.alert)
                                        .toHaveBeenCalledWith(expect.stringMatching(/Max.*instruments/)));
    });

    it("should call addInstrumentToMarketfeed for valid input", () => {
        // Given
        const instruments = createInstruments(MAX_INSTRUMENTS+1);
        addInstrumentToMarketfeedVerify(instruments[MAX_INSTRUMENTS].symbol,
                                       { ...props,
                                         searchInstruments: instruments,
                                         marketfeedInstruments:[]},
                                       () => expect(props.addInstrumentToMarketfeed).toHaveBeenCalled());
    });
});
