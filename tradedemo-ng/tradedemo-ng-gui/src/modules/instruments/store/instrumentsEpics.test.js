import "rxjs/add/operator/toArray";
import "rxjs/add/operator/take";
import { ActionsObservable } from 'redux-observable';
import { Subject } from 'rxjs';
import { selectMarketfeedInstrumentEpic } from "./instrumentsEpics";
import { selectMarketfeedInstrument } from "./instrumentsActions";
import { fetchIntradayTimeSeries,
         fetchDailyTimeSeries } from "../../timeSeries/store/timeSeriesActions";

/**
 *
 * Unit tests selectMarketfeedInstrumentEpic only. The other instrumentsEpics
 * are covered by the instruments.integration.tests. This unit test only verify the correct
 * actions are dispatched as we do not want to verify the store for timeSeries inside
 * the instruments module.
 *
 */
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
