export const INSTRUMENTS = ({
    FETCH_INSTRUMENTS: "FETCH_INSTRUMENTS",
    FETCH_INSTRUMENTS_SUCCESS: "FETCH_INSTRUMENTS_SUCCESS",
    FETCH_INSTRUMENTS_FAILURE: "FETCH_INSTRUMENTS_FAILURE"
});

export const fetchInstruments = callback => ({
    type: INSTRUMENTS.FETCH_INSTRUMENTS
});

export const fetchInstrumentsSuccess = instruments => ({
    type: INSTRUMENTS.FETCH_INSTRUMENTS_SUCCESS,
    payload: instruments
});

export const fetchInstrumentsFailure = message => ({
    type: INSTRUMENTS.FETCH_INSTRUMENTS_FAILURE,
    payload: message
});
