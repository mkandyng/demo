import React from "react";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { combineReducers } from "redux";
import { getDateString,
         padDigits,
         createStoreWithMiddleware } from "../../libs/utils";
import { MAX_INSTRUMENTS } from "../instruments/instruments";
import * as orderbook from "../../modules/orderbook/store/orderbookReducer";
import * as instruments from "../../modules/instruments/store/instrumentsReducer";
import { instrumentsEpics } from "../../modules/instruments/store/instrumentsEpics";
import { placeOrder, updateOrder } from "../../modules/orderbook/store/orderbookActions"
import { fetchInstruments } from "../../modules/instruments/store/instrumentsActions";
import { createInstruments,
         getJSONFunction } from "../instruments/instruments.test.helpers";
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
        store = createStoreWithMiddleware({getJSON: url => getJSONFunction(url, createInstruments(MAX_INSTRUMENTS))},
                                           combineReducers({
                                              [orderbook.NAME]:orderbook.orderbookReducer,
                                              [instruments.NAME]: instruments.instrumentsReducer
                                            }),
                                            instrumentsEpics);
        store.dispatch(fetchInstruments());
        props = {
            instrument: store.getState().instruments.selected,
            placeOrder: order => store.dispatch(placeOrder(order)),
            updateOrder: order => store.dispatch(updateOrder(order)),
            enableDemo: false
        }
        component = mount(<Ticket {... props} />);
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
        const verifyOrderType = (orderType, expectedOpacity, instrument) => {
            verifyTicketChange("select", "orderType", orderType);
            expect(component.state().priceStyle).toStrictEqual({"opacity": expectedOpacity});
        }
        const instrument = store.getState().instruments.marketfeedInstruments[0];
        verifyOrderType("Market", 0.5, instrument);
        verifyOrderType("Limit", 1.0, instrument);
        verifyOrderType("Stop", 1.0, instrument);
        verifyOrderType("Stop Limit", 1.0, instrument);
    });

    it("should handle expiryType change", () => {
        const verifyExpiryType = (expiryType, expectedOpacity, expectedExpiryDate) => {
            verifyTicketChange("select", "expiryType", expiryType);
            expect(component.state().expiryDateStyle).toStrictEqual({"opacity": expectedOpacity});
            expect(component.state().expiryDate).toStrictEqual(expectedExpiryDate);
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
            const expectedOrderRef = "XA"+ padDigits(component.state().orderId, 8);
            const ticket = mount(<Ticket {... props} ticket={component.state()}/>)

            // when
            ticket.find("div#" + buySellId)
                  .simulate("click", { target: { innerText: buySell }});

            // Then
            const newOrder = store.getState().orderbook.find(
                                  order=>order.orderRef === expectedOrderRef);
            expect(newOrder).not.toBeUndefined();
            expect(newOrder.buySell).toStrictEqual(buySell);
        }
        verifyBuySellButtonClickSubmitOrder("buyButton", "Buy");
        verifyBuySellButtonClickSubmitOrder("sellButton", "Sell");
    });

    it("should handle buy/sell submit click when confirm is false, no order placed", () => {
        window.confirm = jest.fn(() => false);
        verifyNoOrderPlaced("buyButton", "Buy");
        verifyNoOrderPlaced("sellButton", "Sell");
    });

    it("should handle buy/sell submit click when quantity zero is rejected, no order placed", () => {
        window.confirm = jest.fn(() => true);
        verifyNoOrderPlaced("buyButton", "Buy", {quantity: 0});
        verifyNoOrderPlaced("sellButton", "Sell", {quantity: 0});
        expect(window.alert).toHaveBeenCalled();
    });

    const verifyNoOrderPlaced = (buySellId, buySell, ticketPropsChange = {}) => {
        // Given
        const ticket = mount(<Ticket {... props}/>)
        ticket.setState(ticketPropsChange);

        // when
        ticket.find("div#" + buySellId)
              .simulate("click", { target: { innerText: buySell }});

        // Then
        expect(store.getState().orderbook.length).toStrictEqual(0);
    }

    const verifyTicketChange = (elementTag, inputName, changeValue) => {
        // Given
        const element = component.find(elementTag).find({ name: inputName })

        // when
        element.simulate('change', { target: { name: inputName, value: changeValue }});

        // Then
        expect(component.state()[inputName]).toStrictEqual(changeValue);
    }
});
