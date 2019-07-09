import { throwError } from 'rxjs';
import { fetchInstruments,
         addInstrumentToMarketfeed,
         selectMarketfeedInstrument,
         updateMarketfeedInstrument,
         deleteMarketfeedInstrument } from "./instrumentsActions";
import { instrumentsReducer} from "./instrumentsReducer";
import { instrumentsEpics } from "./instrumentsEpics";
import { MAX_MARKET_FEED_INSTRUMENTS,
         removeInstrument,
         updateInstrument } from "../instruments";
import { createInstruments,
         getJSONFunction } from "../instruments.test.helpers";
import { createStoreWithMiddleware } from "../../../libs/utils";

/**
 *
 * This is integration test of the redux actions/epics/reducer for instruments store
 * Each instruments actions are invoked and verified expected store state
 *
 */

describe("instruments store integration tests - Happy Path", () => {

    let store = undefined;

    const instruments = createInstruments(MAX_MARKET_FEED_INSTRUMENTS)
                            .map(instrument => ({...instrument, price: 1.0, open: 1.0}));

    beforeEach(() => {

        store = createStoreWithMiddleware({getJSON: url => getJSONFunction(url, instruments)},
                                          instrumentsReducer,
                                          instrumentsEpics);
    });

    it("should fetchInstruments, add to marketfeed and select first element ", () => {
        // Given
        const {price, open, ...expectedInstrument} = instruments[MAX_MARKET_FEED_INSTRUMENTS];
        const expectedMarketfeedInstruments = removeInstrument(instruments,
                                                               expectedInstrument.symbol).reverse();

        const action = fetchInstruments();

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            searchInstruments: [expectedInstrument],
            marketfeedInstruments: expectedMarketfeedInstruments,
            selected: expectedMarketfeedInstruments[0]
        });
    });

    it("should addInstrumentToMarketfeed and select first element ", () => {
        // Given
        store.dispatch(fetchInstruments());

        const action = addInstrumentToMarketfeed(instruments[MAX_MARKET_FEED_INSTRUMENTS]);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            searchInstruments: [],
            marketfeedInstruments: (instruments.slice().reverse()),
            selected: instruments[MAX_MARKET_FEED_INSTRUMENTS]
        });
    });

    it("should selectMarketfeedInstrument to a given instrument", () => {
        // Given
        const {price, open, ...expectedInstrument} = instruments[MAX_MARKET_FEED_INSTRUMENTS];
        const expectedMarketfeedInstruments = removeInstrument(instruments,
                                                               expectedInstrument.symbol).reverse();

        store.dispatch(fetchInstruments());

        const action = selectMarketfeedInstrument(instruments[0]);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            searchInstruments: [expectedInstrument],
            marketfeedInstruments: expectedMarketfeedInstruments,
            selected: instruments[0]
        });

    });

    it("should updateMarketfeedInstrument to a given instrument ", () => {
        // Given
        const {price, open, ...expectedInstrument} = instruments[MAX_MARKET_FEED_INSTRUMENTS];
        const expectedMktfeedInstruments = removeInstrument(instruments,
                                                            expectedInstrument.symbol).reverse();

        store.dispatch(fetchInstruments());
        const updatingInstrument = {...instruments[0], price: 1.5, open: 1.2};

        const action = updateMarketfeedInstrument(updatingInstrument);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            searchInstruments: [expectedInstrument],
            marketfeedInstruments: updateInstrument(expectedMktfeedInstruments,
                                                    updatingInstrument),
            selected: expectedMktfeedInstruments[0]
        });

    });

    it("should deleteMarketfeedInstrument to a given instrument ", () => {
        // Given
        const {price, open, ...expectedInstrument} = instruments[MAX_MARKET_FEED_INSTRUMENTS];
        const expectedMktfeedInstruments = removeInstrument(instruments,
                                                            expectedInstrument.symbol).reverse();
        store.dispatch(fetchInstruments());
        const deleteInstrument = instruments[0];

        const action = deleteMarketfeedInstrument(deleteInstrument);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            searchInstruments: [deleteInstrument, expectedInstrument],
            marketfeedInstruments: removeInstrument(expectedMktfeedInstruments,
                                                    deleteInstrument.symbol),
            selected: expectedMktfeedInstruments[0]
        });
    });

});

describe("instruments store integration tests - Invalid Path", () => {

    let instruments = undefined;
    let store = undefined;
    const error = new Error("error");
    console.log = jest.fn();

    beforeEach(() => {
        instruments = createInstruments(MAX_MARKET_FEED_INSTRUMENTS).map(instrument => ({...instrument, price: 1.0, open: 1.0}));

        store = createStoreWithMiddleware({getJSON:() => throwError(error)},
                                          instrumentsReducer,
                                          instrumentsEpics);
    });

    it("should log error when fetchInstruments throw error ", done => {
        // Given
        const action = fetchInstruments();

        // When
        store.dispatch(action);

        // Then
        expect(console.log).toHaveBeenCalledWith(expect.objectContaining(error));

        done();
    });

    it("should log error when addInstrumentToMarketfeed throw error ", () => {
        // Given
        const action = addInstrumentToMarketfeed(instruments[MAX_MARKET_FEED_INSTRUMENTS]);

        // When
        store.dispatch(action);

        // Then
        expect(console.log).toHaveBeenCalledWith(expect.objectContaining(error));

    });

    it("should return initial state for invalid action ", () => {
        // Given
        const action = {type: "invalid_action"};

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            searchInstruments: [],
            marketfeedInstruments: [],
            selected: {}
        });
    });

});
