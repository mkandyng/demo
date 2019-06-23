export const types = {
    UPDATE_TICKET: "ticket/UPDATE"
};

export const updateTicket = ticketProps => ({
    type: types.UPDATE_TICKET,
    ticketProps: ticketProps
});
