import { fetchDailyTimeSeriesEpic,
         fetchIntradayTimeSeriesEpic } from "./timeSeriesEpics";
import { fetchDailyTimeSeries,
         fetchDailyTimeSeriesSuccess,
         fetchDailyTimeSeriesFailure,
         fetchIntradayTimeSeries,
         fetchIntradayTimeSeriesSuccess,
         fetchIntradayTimeSeriesFailure } from "./timeSeriesActions";
import { ActionsObservable } from 'redux-observable';
import { Observable, throwError } from 'rxjs';

/**
 * Unit tests for timeSeriesEpics
 */

describe("fetchDailyTimeSeriesEpic", () => {

    const action$ = ActionsObservable.of(
        fetchDailyTimeSeries("symbol")
    );

    it("should dispatches fetchDailyTimeSeriesSuccess when it is successful ", done => {
        // Given
        const timeSeries = {dateTime:"2019-10-10", open:1.0, high:1.0, low:1.0, close:1.0};
        const {dateTime, ...expectedTimeSeries} = timeSeries;
        const ajax = {
          getJSON: () => Observable.of([timeSeries])
        };

        const expectedOutputAction = fetchDailyTimeSeriesSuccess([{...expectedTimeSeries,
                                                                  name: timeSeries.dateTime}]);

        // When
        fetchDailyTimeSeriesEpic(action$, null, {ajax})
            .subscribe(actualOutputAction => {
        // Then
                expect(actualOutputAction).toStrictEqual(expectedOutputAction);
                done();
            }
        );
    });

    it("should dispatches fetchDailyTimeSeriesFailure when failure ", done => {
        // Given
        const error = new Error("failure");
        const ajax = {
          getJSON: () => throwError(error)
        };

        const expectedOutputAction = fetchDailyTimeSeriesFailure(error);

        // When
        fetchDailyTimeSeriesEpic(action$, null, {ajax})
            .subscribe(actualOutputAction => {
        // Then
                expect(actualOutputAction).toStrictEqual(expectedOutputAction);
                done();
            }
        );
    });
});

describe("fetchIntradayTimeSeriesEpic", () => {

    const action$ = ActionsObservable.of(
        fetchIntradayTimeSeries("symbol")
    );

    it("should dispatches fetchIntradayTimeSeriesSuccess when it is successful ", done => {
        // Given
        const timeSeries = {dateTime:"2019-10-10 11:12", high:2.0, low:1.0};
        const ajax = {
          getJSON: () => Observable.of([timeSeries])
        };

        const expectedOutputAction = fetchIntradayTimeSeriesSuccess([{name: "11:12",
                                                                      price: 1.5}]);

        // When
        fetchIntradayTimeSeriesEpic(action$, null, {ajax})
            .subscribe(actualOutputAction => {
        // Then
                expect(actualOutputAction).toStrictEqual(expectedOutputAction);
                done();
            }
        );
    });

    it("should dispatches fetchIntradayTimeSeriesFailure when failure ", done => {
        // Given
        const error = new Error("failure");
        const ajax = {
          getJSON: () => throwError(error)
        };

        const expectedOutputAction = fetchIntradayTimeSeriesFailure(error);

        // When
        fetchIntradayTimeSeriesEpic(action$, null, {ajax})
            .subscribe(actualOutputAction => {
        // Then
                expect(actualOutputAction).toStrictEqual(expectedOutputAction);
                done();
            }
        );
    });
});
