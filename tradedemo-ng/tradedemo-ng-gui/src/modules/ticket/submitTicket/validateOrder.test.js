import validateOrder from "./validateOrder";

/**
 * This is unit test of validatorOrder, testing each invalid entries
 */

describe("ValidateOrder", () => {

  const ticket = {
    quantity: 0.1,
    expiryType: "DAY",
    orderType: "Market",
    expiryDate: new Date()
  };

  window.alert = jest.fn();
  it("should fail validation placing zero quantity order", () => {
    // Given
    const newTicket = {...ticket,quantity: 0};

    // When
    const success = validateOrder(newTicket);

    // Then
    expect(window.alert).toHaveBeenCalled();
    expect(success).toBeFalsy();
  });

  it("should fail validation if expiryType is GTD and date is yesterday", () => {
    // Given
    const date = ticket.expiryDate;
    date.setDate(date.getDate() - 1);
    const newTicket = {...ticket,expiryType: "GTD",expiryDate: date};

    // When
    const success = validateOrder(newTicket);

    // Then
    expect(window.alert).toHaveBeenCalled();
    expect(success).toBeFalsy();
  });

  it("should fail validation if orderType is not market and instrument price outside 5% range", () => {
    // Given
    const newTicket = {...ticket,orderType: "Limit",price: 1.0};
    const instrument = {price: 1.5,name: "name"};

    // When
    const success = validateOrder(newTicket, instrument);

    // Then
    expect(window.alert).toHaveBeenCalled();
    expect(success).toBeFalsy();
  });

});
