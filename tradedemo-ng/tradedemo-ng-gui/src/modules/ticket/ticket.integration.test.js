import React from "react";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { Observable } from 'rxjs';
import { combineEpics } from "redux-observable";
import { fetchInstrumentsEpic,
         addInstrumentToMarketfeedEpic,
         selectMarketfeedInstrumentEpic } from "../../modules/instruments/store/instrumentsEpics";
import { getDateString, padDigits } from "../../libs/utils";
import * as orderbook from "../../modules/orderbook/store/orderbookReducer";
import * as instruments from "../../modules/instruments/store/instrumentsReducer";
import * as ticket from "./store/ticketReducer";
import { updateTicket } from "./store/ticketActions";
import { placeOrder, updateOrder } from "../../modules/orderbook/store/orderbookActions"
import { fetchInstruments } from "../../modules/instruments/store/instrumentsActions";
import Ticket from "./Ticket";

/**
 *
 * Test of Ticket component integrate with Redux store
 *
 */

const mockModule = require('../../modules/instruments/marketfeed');
mockModule.generateMarketfeedMovement = jest.fn(expectedInstrument => expectedInstrument);

describe("ticket integration tests", () => {
    let store = undefined;
    let component = undefined;
    let props = undefined;

    beforeEach(() => {
        store = createStoreWithMiddleware();
        store.dispatch(fetchInstruments());
        props = {
            ticket: store.getState().ticket,
            instrument: store.getState().instruments.selected,
            placeOrder: order => store.dispatch(placeOrder(order)),
            updateOrder: order => store.dispatch(updateOrder(order)),
            updateTicket: ticketProps => store.dispatch(updateTicket(ticketProps)),
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
            const replacedPrice = instrument.price + 1.5;
            store.dispatch(updateTicket({price: replacedPrice}));
            expect(store.getState().ticket.price).toStrictEqual(replacedPrice);
            verifyTicketChange("select", "orderType", orderType);
            expect(store.getState().ticket.price).not.toStrictEqual(replacedPrice);
            expect(store.getState().ticket.price).toStrictEqual(instrument.price.toFixed(2));
            expect(store.getState().ticket.priceStyle).toStrictEqual({"opacity": expectedOpacity});
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
            expect(store.getState().ticket.expiryDateStyle).toStrictEqual({"opacity": expectedOpacity});
            expect(store.getState().ticket.expiryDate).toStrictEqual(expectedExpiryDate);
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
            const expectedOrderRef = "XA"+ padDigits(store.getState().ticket.orderId, 8);
            const ticket = mount(<Ticket {... props} ticket={store.getState().ticket}/>)

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
        window.alert = jest.fn();
        store.dispatch(updateTicket({quantity:0}));
        verifyNoOrderPlaced("buyButton", "Buy");
        verifyNoOrderPlaced("sellButton", "Sell");
        expect(window.alert).toHaveBeenCalled();
    });

    const verifyNoOrderPlaced = (buySellId, buySell) => {
        // Given
        const ticket = mount(<Ticket {... props} ticket={store.getState().ticket}/>)

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
        element.simulate('change', { target: { value: changeValue }});

        // Then
        expect(store.getState().ticket[inputName]).toStrictEqual(changeValue);
    }
});

function createInstruments(count) {
    let instruments = [];
    for (let i=0; i<= count; i++) {
        instruments.push({symbol:"symbol" + i, name:"instrument" + i, currency: "USD"});
    }
    return instruments;
}

function createStoreWithMiddleware() {
    const ajax = {
        getJSON: url => {
          if(url.includes("/instruments/")) {
              return Observable.of(createInstruments(10));
          } else if(url.includes("/instrumentQuote/")) {
             return Observable.of({price: 1.0, open: 1.0});
          }
        }
    };

    const rootEpic = (...args) => combineEpics(
                                  fetchInstrumentsEpic,
                                  addInstrumentToMarketfeedEpic,
                                  selectMarketfeedInstrumentEpic)(...args, { ajax });

    const epicMiddleware = createEpicMiddleware();
    const rootReducer = combineReducers({
        [orderbook.NAME]:orderbook.orderbookReducer,
        [ticket.NAME]: ticket.ticketReducer,
        [instruments.NAME]: instruments.instrumentsReducer
    });
    const store = createStore(rootReducer, applyMiddleware(epicMiddleware));
    epicMiddleware.run(rootEpic);
    return store;
}
