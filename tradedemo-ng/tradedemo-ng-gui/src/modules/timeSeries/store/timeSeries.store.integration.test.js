import { Observable, throwError } from 'rxjs';
import { transformTimeSeries,
         roundValue,
         createStoreWithMiddleware } from "../../../libs/utils"
import { timeSeriesEpics } from "./timeSeriesEpics";
import { timeSeriesReducer } from "./timeSeriesReducer";
import { fetchDailyTimeSeries,
         fetchIntradayTimeSeries } from "./timeSeriesActions";

/**
 *
 * This is integration test of the actions/reducer for timeSeries redux store
 * Each order actions are invoked and verified expected store state
 *
 */

describe("timeSeries store integration tests", () => {

    const symbol = "symbol";
    const error = new Error("error");
    console.log = jest.fn();

    it("should fetchDailyTimeSeries if ajax returns successfully ", done => {
        // Given
        const timeSeries = createTimeSeries(i => ({dateTime:"2019-10-12",open: i+1,high:i+3,low:i,close:i+2}), 5);
        const store = createStoreWithMiddleware({getJSON: url => Observable.of(timeSeries)},
                                                timeSeriesReducer,
                                                timeSeriesEpics);
        const action = fetchDailyTimeSeries(symbol);
        const expectedTimeSeries = transformTimeSeries(timeSeries.map(timeSeries => {
            const {dateTime, ...expected} = timeSeries;
            return {...expected, name: timeSeries.dateTime};
        }).reverse(), o => o.high, o => o.low);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toEqual(
            { symbol: symbol,
              intradayTimeSeries:{},
              dailyTimeSeries: expectedTimeSeries}
        );

        done();
    });

    it("should fetchIntradayTimeSeries if ajax returns successfully ", done => {
        // Given
        const timeSeries = createTimeSeries(i => ({dateTime:"2019-10-12 11:11:10.123",
                                                   high:i+3,low:i}), 1);
        const store = createStoreWithMiddleware({getJSON:url => Observable.of(timeSeries)},
                                                 timeSeriesReducer,
                                                 timeSeriesEpics);
        const action = fetchIntradayTimeSeries(symbol);
        const expectedTimeSeries = transformTimeSeries(timeSeries.map(timeSeries => {
            const {dateTime, high, low, ...expected} = timeSeries;
            return {...expected,
                    name: timeSeries.dateTime.substr(11,5),
                    price: roundValue((high + low)/2, 100)};
        }).reverse(), o => o.price, o => o.price);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toEqual(
            { symbol: symbol,
              intradayTimeSeries:expectedTimeSeries,
              dailyTimeSeries: {}}
        );

        done();
    });

    it("should log error if fetchDailyTimeSeries ajax error", done => {
        // Given
        const store = createStoreWithMiddleware({getJSON:() => throwError(error)},
                                                timeSeriesReducer,
                                                timeSeriesEpics);
        const action = fetchDailyTimeSeries(symbol);

        // When
        store.dispatch(action);

        // Then
        expect(console.log).toHaveBeenCalledWith(error);


        done();
    });
});

function createTimeSeries(timeSeriesGenerator, count) {
    let timeSeries = [];
    for (let i=0; i<= count; i++) {
        timeSeries.push(timeSeriesGenerator(i));
  }
  return timeSeries;
}
