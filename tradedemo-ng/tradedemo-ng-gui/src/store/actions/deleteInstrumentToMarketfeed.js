export const DELETE_INSTRUMENT_TO_MARKETFEED = "DELETE_INSTRUMENT_TO_MARKETFEED";

export const deleteInstrumentToMarketfeed = (instrument) => ({
    type: DELETE_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument,
    selectedMarketfeedIndex: 0
});
