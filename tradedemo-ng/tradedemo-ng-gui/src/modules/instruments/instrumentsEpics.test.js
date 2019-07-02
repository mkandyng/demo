import "rxjs/add/operator/toArray";
import "rxjs/add/operator/take";
import { ActionsObservable } from 'redux-observable';
import { Observable, throwError, Subject } from 'rxjs';
import { fetchInstrumentsEpic,
         addInstrumentToMarketfeedEpic,
         selectMarketfeedInstrumentEpic } from "./instrumentsEpics";
import { fetchInstruments,
         fetchInstrumentsSuccess,
         fetchInstrumentsFailure,
         addInstrumentToMarketfeed,
         addInstrumentToMarketfeedSuccess,
         addInstrumentToMarketfeedFailure,
         selectMarketfeedInstrument } from "./instrumentsActions";
import { fetchIntradayTimeSeries,
         fetchDailyTimeSeries } from "../timeSeries/timeSeriesActions";

/**
 * Unit tests for instrumentsEpics
 */
describe("fetchInstrumentsEpic", () => {

    const action$ = ActionsObservable.of(
        fetchInstruments()
    );

    it("should dispatches actions when it is successful ", done => {
        // Given
        const instrument = {symbol:"symbol", name:"instrument name", currency: "USD"};
        const ajax = {
          getJSON: () => Observable.of([instrument])
        };
        const expectedActions = [fetchInstrumentsSuccess([instrument]),
                                 addInstrumentToMarketfeed(instrument)];

        // When
        testEpic(fetchInstrumentsEpic, expectedActions.length, {ajax}, action$, (actions) => {
            // Then
            expect(actions).toStrictEqual(expectedActions);
            done();
        });
    });

    it("should dispatches fetchInstrumentsFailure when failure ", done => {
        // Given
        const error = new Error("failure");
        const ajax = {
          getJSON: () => throwError(error)
        };

        const expectedOutputAction = fetchInstrumentsFailure(error);

        // When
        fetchInstrumentsEpic(action$, null, {ajax})
            .subscribe(actualOutputAction => {
        // Then
                expect(actualOutputAction).toStrictEqual(expectedOutputAction);
                done();
            }
        );
    });
});

describe("addInstrumentToMarketfeedEpic", () => {
    const instrument = {symbol:"symbol", name:"instrument name", currency: "USD"};
    const action$ = ActionsObservable.of(
        addInstrumentToMarketfeed(instrument)
    );

    it("should dispatches actions when it is successful ", done => {
        // Given
        const instrumentQuote = { price: 1.0, open: 1.0 };
        const ajax = {
          getJSON: () => Observable.of(instrumentQuote)
        };

        const expectedInstrument = {...instrument, ...instrumentQuote};

        const expectedActions = [addInstrumentToMarketfeedSuccess(expectedInstrument),
                                 selectMarketfeedInstrument(expectedInstrument)];

        const mockModule = require('./generateMarketfeedMovement');
        mockModule.generateMarketfeedMovement = jest.fn(expectedInstrument => expectedInstrument);

        // When
        testEpic(addInstrumentToMarketfeedEpic,
                 expectedActions.length,
                 {ajax},
                 action$,
                 (actions) => {
        // Then
            expect(actions).toStrictEqual(expectedActions);
            done();
        });
    });

    it("should dispatches addInstrumentToMarketfeedFailure when failure ", done => {
        // Given
        const error = new Error("failure");
        const ajax = {
          getJSON: () => throwError(error)
        };

        const expectedOutputAction = addInstrumentToMarketfeedFailure(error);

        // When
        addInstrumentToMarketfeedEpic(action$, null, {ajax})
            .subscribe(actualOutputAction => {
        // Then
                expect(actualOutputAction).toStrictEqual(expectedOutputAction);
                done();
            }
        );
    });
});

describe("selectMarketfeedInstrumentEpic", () => {
    const instrument = {symbol:"symbol", name:"instrument name", currency: "USD"};
    const action$ = ActionsObservable.of(
        selectMarketfeedInstrument(instrument)
    );

    it("should dispatches actions when selectMarketfeedInstrument  ", done => {
        // Given
        const expectedActions = [fetchIntradayTimeSeries(instrument.symbol),
                                 fetchDailyTimeSeries(instrument.symbol)];

        // When
        testEpic(selectMarketfeedInstrumentEpic,
                 expectedActions.length,
                 {},
                 action$,
                 (actions) => {
        // Then
            expect(actions).toStrictEqual(expectedActions);
            done();
        });
    });


});


function testEpic(epic, count, ajax, action$, callback, state = {}){
    const actions = new Subject()
    const store = { getState: () => state }
    epic(action$, store, ajax)
      .take(count)
      .toArray()
      .subscribe(callback)
      if (actions.length) {
        actions.map(act => actions.next(act))
      } else {
        actions.next(action$)
      }
}
