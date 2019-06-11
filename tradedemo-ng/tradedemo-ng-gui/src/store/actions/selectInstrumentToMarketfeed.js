export const SELECT_INSTRUMENT_TO_MARKETFEED = "SELECT_INSTRUMENT_TO_MARKETFEED";

export const selectInstrumentToMarketfeed = instrument => ({
    type: SELECT_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument
});
