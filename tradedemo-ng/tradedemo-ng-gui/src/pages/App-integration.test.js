import { shallow, mount } from "enzyme";
import toJson from "enzyme-to-json";
import { rootEpic } from "../modules/rootEpics";
import { rootReducer } from "../modules/rootReducer";
import { createInstruments, getJSONFunction } from "../modules/instruments/instruments.test.helpers";
import { MAX_MARKET_FEED_INSTRUMENTS } from "../modules/instruments/instruments";
import { createStoreWithMiddleware } from "../libs/utils";
import appWithProvider from "./App";

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
describe("App Integration Test", () => {
    let component = undefined;
    let store = undefined;
    const instruments = createInstruments(MAX_MARKET_FEED_INSTRUMENTS)
                              .map(instrument => ({ ...instrument,
                                                    price: 1.0,
                                                    open: 1.0 }));
    beforeEach(() => {
        store = createStoreWithMiddleware({getJSON: url => getJSONFunction(url, instruments)},
                                           rootReducer,
                                           rootEpic);
        component = mount(appWithProvider(store));
    });

    it("should initialise app and matched with previous shallow snapshot", () => {
        component = shallow(appWithProvider(store));
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should validate redux store is working as expected", () => {

    });

    it("should generate instrument search markup", () => {

    });

    it("should generate marketfeed markup", () => {

    });

    it("should update ticket marketdata when selected marketfeed change prices", () => {

    });

    it("should submit ticket to generate orderbook markup", () => {

    });

    it("should handle marketfeed select to generate ticket markup", () => {

    });

    it("should handle marketfeed select to generate intraday timeSeries markup", () => {

    });

    it("should handle marketfeed select to generate daily timeSeries markup", () => {

    });

});
