import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { Observable, throwError } from 'rxjs';
import { combineEpics } from "redux-observable";
import { fetchInstrumentsEpic,
         addInstrumentToMarketfeedEpic,
         selectMarketfeedInstrumentEpic } from "./instrumentsEpics";
import { removeInstrument,
         updateInstrument } from "../../../libs/utils"
import { instrumentsReducer } from "./instrumentsReducer";
import { fetchInstruments,
         addInstrumentToMarketfeed,
         selectMarketfeedInstrument,
         updateMarketfeedInstrument,
         deleteMarketfeedInstrument } from "./instrumentsActions";
import { MAX_MARKET_FEED_INSTRUMENTS } from "../marketfeed";

/**
 *
 * This is integration test of the redux actions/epics/reducer for instruments store
 * Each instruments actions are invoked and verified expected store state
 *
 */

const mockModule = require('../marketfeed');
mockModule.generateMarketfeedMovement = jest.fn(expectedInstrument => expectedInstrument);

describe("instruments integration tests - Happy Path", () => {

    let instruments = undefined;
    let store = undefined;

    beforeEach(() => {
        instruments = createInstruments(MAX_MARKET_FEED_INSTRUMENTS).map(instrument => ({...instrument, price: 1.0, open: 1.0}));

        function getJSONFunction(url){
            if(url.includes("/instruments/")) {
                return Observable.of(instruments);
            } else if(url.includes("/instrumentQuote/")) {
               return Observable.of({price: 1.0, open: 1.0});
            }
        }

        store = createStoreWithMiddleware(getJSONFunction);
    });

    it("should fetchInstruments, add to marketfeed and select first element ", done => {
        // Given
        const action = fetchInstruments();
        const {price, open, ...expectedInstrument} = instruments[MAX_MARKET_FEED_INSTRUMENTS];
        const expectedMarketfeedInstruments = removeInstrument(instruments, expectedInstrument.symbol).reverse();

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            instruments: [expectedInstrument],
            marketfeedInstruments: expectedMarketfeedInstruments,
            selected: expectedMarketfeedInstruments[0]
        });

        done();
    });

    it("should addInstrumentToMarketfeed and select first element ", done => {
        // Given
        store.dispatch(fetchInstruments());
        const action = addInstrumentToMarketfeed(instruments[MAX_MARKET_FEED_INSTRUMENTS]);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            instruments: [],
            marketfeedInstruments: (instruments.slice().reverse()),
            selected: instruments[MAX_MARKET_FEED_INSTRUMENTS]
        });

        done();
    });

    it("should selectMarketfeedInstrument to a given instrument", done => {
        // Given
        const {price, open, ...expectedInstrument} = instruments[MAX_MARKET_FEED_INSTRUMENTS];
        const expectedMarketfeedInstruments = removeInstrument(instruments, expectedInstrument.symbol).reverse();

        store.dispatch(fetchInstruments());
        const action = selectMarketfeedInstrument(instruments[0]);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            instruments: [expectedInstrument],
            marketfeedInstruments: expectedMarketfeedInstruments,
            selected: instruments[0]
        });

        done();
    });

    it("should updateMarketfeedInstrument to a given instrument ", done => {
        // Given
        const {price, open, ...expectedInstrument} = instruments[MAX_MARKET_FEED_INSTRUMENTS];
        const expectedMarketfeedInstruments = removeInstrument(instruments, expectedInstrument.symbol).reverse();

        store.dispatch(fetchInstruments());
        const updatingInstrument = {...instruments[0], price: 1.5, open: 1.2};
        const action = updateMarketfeedInstrument(updatingInstrument);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            instruments: [expectedInstrument],
            marketfeedInstruments: updateInstrument(expectedMarketfeedInstruments, updatingInstrument),
            selected: expectedMarketfeedInstruments[0]
        });

        done();
    });

    it("should deleteMarketfeedInstrument to a given instrument ", done => {
        // Given
        const {price, open, ...expectedInstrument} = instruments[MAX_MARKET_FEED_INSTRUMENTS];
        const expectedMarketfeedInstruments = removeInstrument(instruments, expectedInstrument.symbol).reverse();

        store.dispatch(fetchInstruments());
        const deleteInstrument = instruments[0];
        const action = deleteMarketfeedInstrument(deleteInstrument);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            instruments: [deleteInstrument, expectedInstrument],
            marketfeedInstruments: removeInstrument(expectedMarketfeedInstruments, deleteInstrument.symbol),
            selected: expectedMarketfeedInstruments[0]
        });

        done();
    });

});

describe("instruments integration tests - Invalid Path", () => {

    let instruments = undefined;
    let store = undefined;
    const error = new Error("error");
    console.log = jest.fn();

    beforeEach(() => {
        instruments = createInstruments(MAX_MARKET_FEED_INSTRUMENTS).map(instrument => ({...instrument, price: 1.0, open: 1.0}));

        store = createStoreWithMiddleware(() => throwError(error));
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

    it("should log error when addInstrumentToMarketfeed throw error ", done => {
        // Given
        const action = addInstrumentToMarketfeed(instruments[MAX_MARKET_FEED_INSTRUMENTS]);

        // When
        store.dispatch(action);

        // Then
        expect(console.log).toHaveBeenCalledWith(expect.objectContaining(error));

        done();
    });

    it("should return initial state for invalid action ", done => {
        // Given
        const action = {type: "invalid_action"};
        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({
            instruments: [],
            marketfeedInstruments: [],
            selected: {}
        });

        done();
    });

});

function createInstruments(count) {
    let instruments = [];
    for (let i=0; i<= count; i++) {
        instruments.push({symbol:"symbol" + i, name:"instrument" + i, currency: "USD"});
    }
    return instruments;
}

function createStoreWithMiddleware(getJSONFunction) {
    const ajax = {
        getJSON: getJSONFunction
    };

    const rootEpic = (...args) => combineEpics(
                                fetchInstrumentsEpic,
                                addInstrumentToMarketfeedEpic,
                                selectMarketfeedInstrumentEpic)(...args, { ajax });

    const epicMiddleware = createEpicMiddleware();
    const store = createStore(instrumentsReducer, applyMiddleware(epicMiddleware));
    epicMiddleware.run(rootEpic);
    return store;
}
