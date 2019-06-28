import gnerateMarketfeedMovement from "./generateMarketfeedMovement";

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
        const newInstrument = gnerateMarketfeedMovement(instrument);

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


});
