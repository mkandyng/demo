export const types = {
    FETCH_INSTRUMENTS: "instruments/FETCH_INSTRUMENTS",
    FETCH_INSTRUMENTS_SUCCESS: "instruments/FETCH_INSTRUMENTS_SUCCESS",
    FETCH_INSTRUMENTS_FAILURE: "instruments/FETCH_INSTRUMENTS_FAILURE",
}

export const fetchInstruments = callback => ({
    type: types.FETCH_INSTRUMENTS
});

export const fetchInstrumentsSuccess = instruments => ({
    type: types.FETCH_INSTRUMENTS_SUCCESS,
    payload: instruments
});

export const fetchInstrumentsFailure = message => ({
    type: types.FETCH_INSTRUMENTS_FAILURE,
    payload: message
});
