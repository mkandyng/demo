import * as types from "./actionTypes";

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
