export const UPDATE_INSTRUMENT_TO_MARKETFEED = "UPDATE_INSTRUMENT_TO_MARKETFEED";

export const updateInstrumentToMarketfeed = instrument => ({
    type: UPDATE_INSTRUMENT_TO_MARKETFEED,
    instrument: instrument
});
