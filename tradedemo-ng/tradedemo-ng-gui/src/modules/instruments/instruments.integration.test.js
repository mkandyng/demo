import React from "react";
import toJson from "enzyme-to-json";
import { mount } from "enzyme";
import { createStoreWithMiddleware } from "../../libs/utils";
import { fetchInstruments,
         addInstrumentToMarketfeed,
         selectMarketfeedInstrument,
         deleteMarketfeedInstrument,
         updateMarketfeedInstrument } from "./store/instrumentsActions";
import { instrumentsReducer } from "./store/instrumentsReducer";
import { instrumentsEpics } from "./store/instrumentsEpics";
import { MAX_INSTRUMENTS,
         retrieveInstrument,
         getDeleteId } from "./instruments";
import { addInstrumentToMarketfeedVerify,
         createInstruments,
         getJSONFunction,
         clickAndVerify } from "./instruments.test.helpers";
import InstrumentsSearch from "./InstrumentsSearch";
import InstrumentsMarketfeed from "./InstrumentsMarketfeed";

/**
 *
 * Integrate Test of InstrumentsSearch and InstrumentMarketfeed components
 * with Redux store actions/epics/reducers
 *
 */

describe("InstrumentsSearch integration tests", () => {
    const { store, props } = createStoreAndFetchInstruments();
    const component = mount(<InstrumentsSearch {...props} />);

    it("should render component InstrumentsSearch on mount", () => {
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should add to marketfeedInstruments and remove from instruments", () => {
        const instrumentsToAdd = props.searchInstruments[0];
        addInstrumentToMarketfeedVerify(instrumentsToAdd.symbol,
                                       { ...props, marketfeedInstruments:[] },
                                       () => {
                                          expect(retrieveInstrument(
                                                     store.getState().searchInstruments,
                                                     instrumentsToAdd.symbol)
                                                ).not.toBeDefined();
                                          expect(retrieveInstrument(
                                                     store.getState().marketfeedInstruments,
                                                     instrumentsToAdd.symbol)
                                                ).toBeDefined();
                                       });
    });

});


describe("InstrumentsMarketfeed integration tests", () => {
    const mockModule = require('./instruments');
    mockModule.generateMarketfeedMovement = jest.fn(expectedInstrument => {
      return { ...expectedInstrument,
               delete:<img id={getDeleteId(expectedInstrument)}
                           src="img/delete.png" alt="delete" />}
    });
    const { store, props } = createStoreAndFetchInstruments();
    const component = mount(<InstrumentsMarketfeed {...props} />);

    it("should render component with InstrumentsMarketfeed on mount", () => {
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should select another instrument if not already selected", () => {
        const selectInstrument = props.marketfeedInstruments.find(
                                       instrument => instrument.symbol !== props.instrument.symbol);

        clickAndVerify(component, "div[children='" + selectInstrument.symbol + "']", () => {
            expect(store.getState().selected).toStrictEqual(selectInstrument);
        });
    });

    it("should delete and select next marketfeed", () => {
        const selectedMrkInstrument = props.marketfeedInstruments[0];

        clickAndVerify(component, "img#" + getDeleteId(selectedMrkInstrument), () => {
            const nextSelectedInstrument = props.marketfeedInstruments
                        .find(e => e.symbol !== selectedMrkInstrument.symbol);

            expect(retrieveInstrument(
                store.getState().marketfeedInstruments, selectedMrkInstrument.symbol)
            ).not.toBeDefined();

            expect(retrieveInstrument(
                store.getState().searchInstruments, selectedMrkInstrument.symbol)
            ).toBeDefined();

            expect(store.getState().selected).toStrictEqual(nextSelectedInstrument);
        });
    });
});

function createStoreAndFetchInstruments() {
    const instruments = createInstruments(MAX_INSTRUMENTS+1)
                                  .map(instrument => ({ ...instrument, price: 1.0, open: 1.0 }));

    const store = createStoreWithMiddleware({getJSON: (url) => getJSONFunction(url, instruments)},
                                     instrumentsReducer,
                                     instrumentsEpics);

    store.dispatch(fetchInstruments());

    const props = {
            searchInstruments: store.getState().searchInstruments,
            marketfeedInstruments: store.getState().marketfeedInstruments,
            instrument: store.getState().selected,
            addInstrumentToMarketfeed: instrument =>
                        store.dispatch(addInstrumentToMarketfeed(instrument)),
            selectMarketfeedInstrument: instrument =>
                        store.dispatch(selectMarketfeedInstrument(instrument)),
            updateMarketfeedInstrument: instrument =>
                        store.dispatch(updateMarketfeedInstrument(instrument)),
            deleteMarketfeedInstrument: instrument =>
                        store.dispatch(deleteMarketfeedInstrument(instrument)) };

   return ({ instruments: instruments,
             store: store,
             props: props});
}
