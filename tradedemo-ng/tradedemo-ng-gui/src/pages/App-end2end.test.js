import React from "react";
import {shallow, mount} from "enzyme";
import {Tab} from "react-tabs";
import {act} from 'react-dom/test-utils';
import toJson from "enzyme-to-json";
import {rootEpic} from "../modules/rootEpic";
import {rootReducer} from "../modules/rootReducer";
import {MAX_MARKET_FEED_INSTRUMENTS,
        MAX_INSTRUMENTS,
        getDeleteId} from "../modules/instruments/instruments";
import {updateMarketfeedInstrument} from "../modules/instruments/store/instrumentsActions";
import {createStoreWithMiddleware} from "../libs/utils";
import {createInstruments,
        getJSONFunction,
        clickAndVerify,
        getNextSelectedMarketfeed,
        removeAMarketfeedFromStore} from "../modules/instruments/instruments.test.helpers";
import appWithProvider from "./App";
import InstrumentsSearch from "../modules/instruments/InstrumentsSearch";
import InstrumentsMarketfeed from "../modules/instruments/InstrumentsMarketfeed";
import Ticket from "../modules/ticket/Ticket";
import Orderbook from "../modules/orders/Orderbook";

/**
 *
 * App integration test of application perform end-2-end integration test
 * achieved by minimum amount of mocked behaviour.
 *
 * Note, the following functions are mocked.
 *
 * - All external JSON calls.
 * - generate random marketfeed
 * - alert, confirmation and timeout
 *
 */
describe("App Integration Test - Standard tests", () => {
  let component = undefined;
  let store = undefined;
  window.confirm = () => true;
  const instruments = createInstruments(MAX_INSTRUMENTS).map(instrument => ({
    ...instrument,
    price: 1.0,
    open: 1.0
  }));
  beforeEach(() => {
    store = createStoreWithMiddleware({
      getJSON: url => getJSONFunction(url, instruments)
    }, rootReducer, rootEpic);
    act(() => {
      component = mount(appWithProvider(store));
    });
  });

  it("should initialise app and matched with previous shallow snapshot", () => {
    act(() => {
      component = shallow(appWithProvider(store));
    });
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should validate redux store is working as expected on init", () => {
    const instruments = store.getState().instruments;
    expect(instruments.searchInstruments).toHaveLength(MAX_INSTRUMENTS - MAX_MARKET_FEED_INSTRUMENTS);
    expect(instruments.marketfeedInstruments).toHaveLength(MAX_MARKET_FEED_INSTRUMENTS);
    expect(instruments.selected).toStrictEqual(instruments.marketfeedInstruments[0]);
  });

  it("should add an instrument from searchInstruments to marketfeed", () => {

    // Given
    const instrumentInSearch = {
      ...store.getState().instruments.searchInstruments[0]
    };
    const instrumentSearchInput = component.find(InstrumentsSearch).find({role: "combobox"});
    instrumentSearchInput.simulate("change", {
      target: {
        value: instrumentInSearch.symbol
      }
    });
    removeAMarketfeedFromStore(store);

    // When
    act(() => {
      component.find(InstrumentsSearch).find({value: "Add"}).simulate("click", {preventDefault: jest.fn()});
    });

    // Then
    expect(store.getState().instruments.searchInstruments[0]).not.toEqual(instrumentInSearch);

    expect(store.getState().instruments.marketfeedInstruments[0]).toEqual(expect.objectContaining({symbol: instrumentInSearch.symbol}));
  });

  it("should submit ticket value to orderbook when buying and selling", () => {

    const verify = (buySellId, buySell, orderId) => {
      const nextSelect = getNextSelectedMarketfeed(store.getState().instruments.marketfeedInstruments,
                                                   store.getState().instruments.selected);
      clickAndVerify(component.find(InstrumentsMarketfeed),
                     "div[children='" + nextSelect.symbol + "']",
                     () => {
                       component.find(Ticket).find("div#" + buySellId).simulate("click", {target: {innerText: buySell}});
                       expect(toJson(component.find(Orderbook).find("div[children='" + orderId + "']"))).not.toBeNull();
                       expect(toJson(component.find(Orderbook).find("div[children='" + buySell + "']"))).not.toBeNull();
      });
    }

    verify("buyButton", "Buy", "XA00000000");
    verify("sellButton", "Sell", "XA00000001");

  });
});

describe("App Integration Test - handling marketfeed instrument select", () => {
  const mockModule = require('../modules/instruments/instruments');
  mockModule.generateMarketfeedMovement = jest.fn(expectedInstrument => {
    return {
      ...expectedInstrument,
      delete: <img id={getDeleteId(expectedInstrument)} src="img/delete.png" alt="delete"/>
    }
  });
  let component = undefined;
  let nextSelect = undefined;
  let store = undefined;
  const instruments = createInstruments(MAX_INSTRUMENTS).map(instrument => ({
    ...instrument,
    price: 1.0,
    open: 1.0
  }));
  beforeEach(() => {
    store = createStoreWithMiddleware({
      getJSON: url => getJSONFunction(url, instruments)
    }, rootReducer, rootEpic);
    act(() => {
      component = mount(appWithProvider(store));
      nextSelect = getNextSelectedMarketfeed(store.getState().instruments.marketfeedInstruments, store.getState().instruments.selected);
    });
  });

  it("should select an instrument in the marketfeed", () => {
    clickAndVerify(component.find(InstrumentsMarketfeed), "div[children='" + nextSelect.symbol + "']", () => {
      expect(store.getState().instruments.selected).toStrictEqual(nextSelect);
    });
  });

  it("should update ticket symbol for selected instrument", () => {
    clickAndVerify(component.find(InstrumentsMarketfeed), "div[children='" + nextSelect.symbol + "']", () => {
      expect(component.find(Ticket).find("label").find({name: "symbol"}).props().value).toEqual(nextSelect.symbol);

    });
  });

  it("should update intraday prices tab for selected instrument", () => {
    clickAndVerify(component.find(InstrumentsMarketfeed), "div[children='" + nextSelect.symbol + "']", () => {
      const matchText = "Intraday Prices " + nextSelect.symbol;
      expect(component.find(Tab).find("li[children='" + matchText + "']").text()).toMatch(matchText);
      expect(store.getState().timeSeries.symbol).toEqual(nextSelect.symbol);
    });
  });

  it("should update daily prices tab for selected instrument", () => {
    clickAndVerify(component.find(InstrumentsMarketfeed), "div[children='" + nextSelect.symbol + "']", () => {
      const matchText = "Daily Prices " + nextSelect.symbol;
      expect(component.find(Tab).find("li[children='" + matchText + "']").text()).toMatch(matchText);
      expect(store.getState().timeSeries.symbol).toEqual(nextSelect.symbol);
    });
  });

  it("should update ticket prices if selected marketfeed instrument prices change", () => {
    clickAndVerify(component.find(InstrumentsMarketfeed), "div[children='" + nextSelect.symbol + "']", () => {
      const select = {
        ...nextSelect,
        bidPrice: "1.99",
        askPrice: "1.95"
      };
      store.dispatch(updateMarketfeedInstrument(select));
      expect(component.find("div#sellButton").find("label").text()).toEqual(select.bidPrice);
      expect(component.find("div#buyButton").find("label").text()).toEqual(select.askPrice);
    });
  });

  it("should delete marketfeed and add to searchInstruments", () => {
    clickAndVerify(component.find(InstrumentsMarketfeed), "img#" + getDeleteId(nextSelect), () => {
      expect(store.getState().instruments.searchInstruments[0].symbol).toStrictEqual(nextSelect.symbol);
      expect(toJson(component.find(InstrumentsMarketfeed).find("img#" + getDeleteId(nextSelect)))).toBeNull();
    });
  });

});
