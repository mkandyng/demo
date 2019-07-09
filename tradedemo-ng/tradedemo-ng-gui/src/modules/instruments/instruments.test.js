import { generateMarketfeedMovement,
         retrieveInstrument,
         removeInstrument,
         updateInstrument } from "./instruments";

/**
 * Unit tests for generateMarketfeedMovement
 */

describe("generateMarketfeedMovement", () => {

    it("should generate marketfeed with new price, copy price to last ", () => {
        // Given
        const instrument = {
            symbol: "abc",
            name: "abc ltd",
            currency: "USD",
            price: 10.0,
            open: 9.0,
        }

        // When
        const newInstrument = generateMarketfeedMovement(instrument);

        // Then

        expect(Object.keys(newInstrument)).toEqual(["delete",
                                                    "price",
                                                    "bidPrice",
                                                    "askPrice",
                                                    "symbol",
                                                    "name",
                                                    "currency",
                                                    "last",
                                                    "open",
                                                    "bid",
                                                    "ask",
                                                    "chg"]);

        expect(newInstrument.price).not.toEqual(instrument.price);
        expect(newInstrument.last).toEqual(instrument.price.toFixed(2));
    });

    describe("retrieveInstrument", () => {
        const instruments = [{symbol: "sym1"}, {symbol: "sym2"}];

        it("should return instrument that match given symbol", () => {
            // Given
            const symbol = "sym1"
            // When
            const newInstrument = retrieveInstrument(instruments, symbol);
            // Then
            expect(newInstrument).toBeDefined();
        });

        it("should return undefined if no instrument matches that symbol", () => {
            // Given
            const symbol = "symNoMatch"
            // When
            const newInstrument = retrieveInstrument(instruments, symbol);
            // Then
            expect(newInstrument).not.toBeDefined();
        });
    });

    describe("removeInstrument", () => {
        const instruments = [{symbol: "sym1"}, {symbol: "sym2"}];

        it("should return instruments that do not contain matched symbol", () => {
            // Given
            const symbol = "sym1"
            // When
            const newInstruments = removeInstrument(instruments, symbol);
            // Then
            expect(newInstruments.some(e=>e.symbol===symbol)).toBeFalsy();
            expect(instruments.some(e=>e.symbol===symbol)).toBeTruthy();
        });

        it("should return instruments that matches original", () => {
            // Given
            const symbol = "symNoMatch"
            // When
            const newInstruments = removeInstrument(instruments, symbol);
            // Then
            expect(newInstruments).toStrictEqual(instruments);
        });
    });

    describe("updateInstrument", () => {
        const instruments = [{symbol: "sym1"}, {symbol: "sym2"}];

        it("should return instruments that contain name property for matched symbol", () => {
            // Given
            const newInstrument = {...instruments[0], name:"name1"};
            // When
            const newInstruments = updateInstrument(instruments, newInstrument);
            // Then
            expect(newInstruments.some(e=>e.name===newInstrument.name)).toBeTruthy();
            expect(instruments.some(e=>e.name===newInstrument.name)).toBeFalsy();
        });

        it("should return same instruments if no symbol matches", () => {
            // Given
            const newInstrument = {symbol: "newInstrument"};
            // When
            const newInstruments = updateInstrument(instruments, newInstrument);
            // Then
            expect(newInstruments.some(e=>e.symbol===newInstrument.symbol)).toBeFalsy();
            expect(newInstruments).toStrictEqual(instruments);
        });
    });


});
