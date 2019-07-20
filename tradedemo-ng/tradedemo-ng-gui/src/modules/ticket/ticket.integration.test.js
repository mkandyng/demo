import React from "react";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";
import {combineReducers} from "redux";
import {getDateString, createStoreWithMiddleware} from "../../libs/utils";
import {MAX_INSTRUMENTS} from "../instruments/instruments";
import * as orderbook from "../../modules/orders/store/ordersReducer";
import * as instruments from "../../modules/instruments/store/instrumentsReducer";
import {instrumentsEpics} from "../../modules/instruments/store/instrumentsEpics";
import {placeOrder, updateOrder} from "../../modules/orders/store/ordersActions"
import {fetchInstruments} from "../../modules/instruments/store/instrumentsActions";
import {createInstruments, getJSONFunction} from "../instruments/instruments.test.helpers";
import Ticket from "./Ticket";

/**
 *
 * Test of Ticket component integrate with Redux store to verify against orderbook
 *
 */

describe("ticket integration tests", () => {
  let store = undefined;
  let component = undefined;
  let props = undefined;

  beforeEach(() => {
    store = createStoreWithMiddleware({
      getJSON: url => getJSONFunction(url, createInstruments(MAX_INSTRUMENTS))
    }, combineReducers({
      [orderbook.NAME]: orderbook.ordersReducer,
      [instruments.NAME]: instruments.instrumentsReducer
    }), instrumentsEpics);
    store.dispatch(fetchInstruments());
    props = {
      instrument: store.getState().instruments.selected,
      placeOrder: order => store.dispatch(placeOrder(order)),
      updateOrder: order => store.dispatch(updateOrder(order)),
      enableDemo: false
    }
    component = mount(<Ticket {... props}/>);
  });

  it("should matchSnapshot for mount Ticket component ", () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should handle standard Input change ", () => {
    verifyTicketChange("input", "quantity", 99);
    verifyTicketChange("input", "price", "1.02");
    verifyTicketChange("textarea", "note", "note value");
    verifyTicketChange("input", "expiryDate", "2019-10-11");
  });

  it("should handle orderType change", () => {
    const verifyOrderType = (orderType, expectedOpacity) => {
      verifyTicketChange("select", "orderType", orderType);
      const style = component.find("input").find({name: "price"}).props().style;
      expect(style).toStrictEqual({"opacity": expectedOpacity});
    }
    verifyOrderType("Market", 0.5);
    verifyOrderType("Limit", 1.0);
    verifyOrderType("Stop", 1.0);
    verifyOrderType("Stop Limit", 1.0);
  });

  it("should handle expiryType change", () => {
    const verifyExpiryType = (expiryType, expectedOpacity, expectedExpiryDate) => {
      verifyTicketChange("select", "expiryType", expiryType);
      const expiryDate = component.find("input").find({name: "expiryDate"});
      expect(expiryDate.props().style).toStrictEqual({"opacity": expectedOpacity});
      expect(expiryDate.props().value).toStrictEqual(expectedExpiryDate);
    }
    verifyExpiryType("GTD", 1.0, getDateString(new Date(), "dateOnly"));
    verifyExpiryType("Day", 0.5, "");
    verifyExpiryType("FOK", 0.5, "");
    verifyExpiryType("GTC", 0.5, "");
  });

  it("should handle buy/sell submit click to place order", () => {
    window.confirm = jest.fn(() => true);
    jest.useFakeTimers();
    jest.runAllTimers();
    const verifyBuySellButtonClickSubmitOrder = (buySellId, buySell) => {
      // Given
      const originalCount = store.getState()
                                 .orders
                                 .filter(o => o.buySell === buySell).length;

      // when
      component.find("div#" + buySellId)
               .simulate("click", {target: {innerText: buySell}});

      // Then
      expect(store.getState()
                  .orders
                  .filter(o => o.buySell === buySell))
                  .toHaveLength(originalCount + 1);
    }
    verifyBuySellButtonClickSubmitOrder("buyButton", "Buy");
    verifyBuySellButtonClickSubmitOrder("sellButton", "Sell");
  });

  it("should handle buy/sell submit click when confirm is false, no order placed", () => {
    window.confirm = jest.fn(() => false);
    verifyNoOrderPlaced("buyButton", "Buy");
    verifyNoOrderPlaced("sellButton", "Sell");
  });

  it("should handle buy/sell submit click when quantity negative is rejected, no order placed", () => {
    window.confirm = jest.fn(() => true);
    verifyTicketChange("input", "quantity", -1);
    verifyNoOrderPlaced("buyButton", "Buy");
    verifyNoOrderPlaced("sellButton", "Sell");
    expect(window.alert).toHaveBeenCalled();
  });

  const verifyNoOrderPlaced = (buySellId, buySell) => {

    // when
    component.find("div#" + buySellId)
             .simulate("click", {target: {innerText: buySell}});

    // Then
    expect(store.getState().orders.length).toStrictEqual(0);
  }

  const verifyTicketChange = (elementTag, inputName, changeValue) => {
    // Given
    const element = component.find(elementTag).find({name: inputName});

    // when
    element.simulate('change', {target: {name: inputName, value: changeValue}});

    // Then
    const newValue = component.find(elementTag)
                              .find({name: inputName})
                              .props().value;
    expect(newValue).toStrictEqual(changeValue);
  }
});
