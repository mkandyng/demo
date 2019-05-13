export const SELECT_INSTRUMENT_TO_MARKETFEED = "SELECT_INSTRUMENT_TO_MARKETFEED";

export const selectInstrumentToMarketfeed = (index) => ({
    type: SELECT_INSTRUMENT_TO_MARKETFEED,
    selectedMarketfeedIndex: index
});

