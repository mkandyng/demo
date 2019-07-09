import React from "react";
import toJson from "enzyme-to-json";
import { shallow, mount } from "enzyme";
import { getDeleteId } from "../instruments";
import InstrumentsMarketfeed from "./InstrumentsMarketfeed";
import { sendEventAndVerify, clickAndVerify } from "../instruments.test.helpers";

/**
 *
 * This is unit test of InstrumentsMarketfeed component, it uses shallow to
 * compare with snapshot and mount to simulate events to verify the handler logic
 *
 */

window.alert = jest.fn();
describe("InstrumentsMarketfeed", () => {
    let component = undefined;
    let props = undefined;

    beforeEach(() => {
        props = {
            marketfeedInstruments: [ { delete:<img id="deleteImg-AMZ" src="img/delete.png" alt="delete" />,
                                             symbol: "AMZ" },
                                     { delete:<img id="deleteImg-ABC" src="img/delete.png" alt="delete" />,
                                             symbol: "ABC" }  ],
            instrument: {symbol: "AMZ"},
            selectMarketfeedInstrument: jest.fn(),
            deleteMarketfeedInstrument: jest.fn(),
            updateMarketfeedInstrument: jest.fn()
        };
        component = mount(<InstrumentsMarketfeed {...props} />);
    });

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        component = shallow(<InstrumentsMarketfeed {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should set src to delete_click on mouseout", () => {
        const selectedMktInstrument = props.marketfeedInstruments.find(
                                        e => e.symbol === props.instrument.symbol);
        const event = {target: {src: "valueToReplace"}};
        sendEventAndVerify(component,
                           "mouseover",
                           event,
                           "img#" + getDeleteId(selectedMktInstrument),
                           () => expect(event.target.src).toEqual("img/delete_click.png"));
    });

    it("should set src to delete_click on mouseout", () => {
      const selectedMktInstrument = props.marketfeedInstruments.find(
                                      e => e.symbol === props.instrument.symbol);
      const event = {target: {src: "valueToReplace"}};
      sendEventAndVerify(component,
                         "mouseout",
                         event,
                         "img#" + getDeleteId(selectedMktInstrument),
                         () => expect(event.target.src).toEqual("img/delete.png"));
    });

    it("should call selectMarketfeedInstrument if not already selected", () => {
        const selectInstrument = props.marketfeedInstruments.find(
                                        instrument => instrument.symbol !== props.instrument.symbol);

        clickAndVerify(component, "div[children='" + selectInstrument.symbol + "']", () =>
            expect(props.selectMarketfeedInstrument).toHaveBeenCalledWith(selectInstrument)
        );
    });

    it("should not call selectMarketfeedInstrument if already selected", () => {
        clickAndVerify(component, "div[children='" + props.instrument.symbol + "']", () =>
            expect(props.selectMarketfeedInstrument).not.toHaveBeenCalledWith()
        );
    });

    it("should alert cannot delete when there is only one instrument", () => {
        const selectedMrkInstrument = props.marketfeedInstruments
                        .find(e => e.symbol === props.instrument.symbol);
        component = mount(<InstrumentsMarketfeed { ...props}
                                                   marketfeedInstruments={[selectedMrkInstrument]}/>);

        clickAndVerify(component, "img#" + getDeleteId(selectedMrkInstrument), () =>
            expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/at least one/))
        );

    });

    it("should delete and select first marketfeed when current select is not first", () => {
        const firstMarketfeedInstrument = props.marketfeedInstruments[0];
        const selectedMrkInstrument = props.marketfeedInstruments
                        .find(e => e.symbol !== firstMarketfeedInstrument.symbol);
        deleteAndSelect(component, selectedMrkInstrument, firstMarketfeedInstrument);
    });

    it("should delete and select next marketfeed when current select is first", () => {
        const firstMarketfeedInstrument = props.marketfeedInstruments[0];
        const nextMrkInstrument = props.marketfeedInstruments
                        .find(e => e.symbol !== firstMarketfeedInstrument.symbol);
        deleteAndSelect(component, firstMarketfeedInstrument, nextMrkInstrument);
    });

    function deleteAndSelect(component, selectedMrkInstrument, nextSelectedInstrument) {
        clickAndVerify(component, "img#" + getDeleteId(selectedMrkInstrument), () => {

            expect(props.deleteMarketfeedInstrument)
                        .toHaveBeenCalledWith(
                            expect.objectContaining({symbol: selectedMrkInstrument.symbol}
                        )
            );

            expect(props.selectMarketfeedInstrument)
                        .toHaveBeenCalledWith(
                            expect.objectContaining({symbol: nextSelectedInstrument.symbol}
                        )
            );
        });
    }

});
