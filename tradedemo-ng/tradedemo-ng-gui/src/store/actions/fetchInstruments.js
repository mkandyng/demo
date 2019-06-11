export const FETCH_INSTRUMENTS = "FETCH_INSTRUMENTS";
export const FETCH_INSTRUMENTS_SUCCESS = "FETCH_INSTRUMENTS_SUCCESS";
export const FETCH_INSTRUMENTS_FAILURE = "FETCH_INSTRUMENTS_FAILURE";

export const fetchInstruments = callback => ({
    type: FETCH_INSTRUMENTS
});

export const fetchInstrumentsSuccess = instruments => ({
    type: FETCH_INSTRUMENTS_SUCCESS,
    payload: instruments
});

export const fetchInstrumentsFailure = message => ({
    type: FETCH_INSTRUMENTS_FAILURE,
    payload: message
});
