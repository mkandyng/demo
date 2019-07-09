import React from "react";
import { mount } from "enzyme";
import { Observable } from 'rxjs';
import InstrumentsSearch from "./InstrumentsSearch";

// Need to mock this so that we do not generate movement which affect the snapshot comparison
const mockModule = require('./instruments');
mockModule.generateMarketfeedMovement = jest.fn(expectedInstrument => expectedInstrument);
window.alert = jest.fn();

// Helper function when clicked on Add instrument
export function addInstrumentToMarketfeedVerify(value, props, verify) {
    // Given
    const component = mount(<InstrumentsSearch {...props} />);
    component.find("input").find({role: "combobox"})
                           .simulate("change", {target: {value: value}});
    const submitInput = component.find("input").find({value: "Add"});

    // When
    submitInput.simulate("click", {event: {preventDefault: jest.fn()}});

    // Then
    verify();
}

// Helper function when clicked on marketfeed
export function clickAndVerify(component, cssSelector, verifyFunction) {
    sendEventAndVerify(component, "click", {}, cssSelector, verifyFunction)
}

// Helper function when send event on marketfeed
export function sendEventAndVerify(component, eventAction, event, cssSelector, verifyFunction) {
    const rowColumn = component.find("TdComponent")
                               .find(cssSelector);

    rowColumn.simulate(eventAction, event);

    verifyFunction();
}

export function getJSONFunction(url, instruments){
    if(url.includes("/instruments/")) {
        return Observable.of(instruments);
    } else if(url.includes("/instrumentQuote/")) {
       return Observable.of({price: 1.0, open: 1.0});
    }
}

// Helper function to generate instruments
export function createInstruments(count) {
    let instruments = [];
    for (let i=0; i<= count; i++) {
        instruments.push({symbol:"symbol" + i, name:"instrument" + i, currency: "USD"});
    }
    return instruments;
}
