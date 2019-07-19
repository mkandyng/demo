import React from "react";
import {mount} from "enzyme";
import {Observable} from 'rxjs';
import InstrumentsSearch from "./InstrumentsSearch";
import {deleteMarketfeedInstrument} from "./store/instrumentsActions";

// Need to mock this so that we do not generate movement which affect the snapshot comparison
const mockModule = require('./instruments');
mockModule.generateMarketfeedMovement = jest.fn(expectedInstrument => expectedInstrument);
window.alert = jest.fn();

// Helper function when clicked on Add instrument
export function addInstrumentToMarketfeedVerify(value, props, verifyFunction) {
  // Given
  const component = mount(<InstrumentsSearch {...props}/>);
  component.find("input")
           .find({role: "combobox"})
           .simulate("change", {target: {value: value}});
  const submitInput = component.find("input").find({value: "Add"});

  // When
  submitInput.simulate("click", {event: {preventDefault: jest.fn()}});

  // Then
  verifyFunction();
}

export function removeAMarketfeedFromStore(store) {
  const marketfeedInstrument = {
    ...store.getState().instruments.marketfeedInstruments[0]
  };
  store.dispatch(deleteMarketfeedInstrument(marketfeedInstrument));
  return marketfeedInstrument;
}

// Helper function when clicked on marketfeed
export function clickAndVerify(component, cssSelector, verifyFunction) {
  sendEventAndVerify(component, "click", {}, cssSelector, verifyFunction)
}

export function getNextSelectedMarketfeed(marketfeedInstruments, instrument) {
  return marketfeedInstruments.find(e => e.symbol !== instrument.symbol);
}

// Helper function when send event on marketfeed
export function sendEventAndVerify(component, eventAction, event, cssSelector, verifyFunction) {
  const rowColumn = component.find("TdComponent").find(cssSelector);
  rowColumn.simulate(eventAction, event);
  verifyFunction();
}

// Helper function to mock expected data from Url
export function getJSONFunction(url, instruments) {
  if (url.includes("/instruments/")) {
    return Observable.of(instruments);
  } else if (url.includes("/instrumentQuote/")) {
    return Observable.of({price: 1.0, open: 1.0});
  } else if (url.includes("/dailyPrices/")) {
    return Observable.of([{dateTime: "2019-10-11",high: 1.0,open: 1.0,low: 1.0,close: 1.0}]);
  } else if (url.includes("/intradayPrices/")) {
    return Observable.of([{dateTime: "2019-10-12 11:11:10.123",high: 1.0,open: 1.0,low: 1.0,close: 1.0}]);
  } else {
    console.log(new Error("Mock implementation of rest api not implemented [" + url + "], please check!"));
  }
}

// Helper function to generate instruments
export function createInstruments(count) {
  let instruments = [];
  for (let i = 0; i < count; i++) {
    instruments.push({symbol: "symbol" + i,name: "instrument" + i,currency: "USD"});
  }
  return instruments;
}
