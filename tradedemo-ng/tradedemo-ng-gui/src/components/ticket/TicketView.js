import React from "react";
import BuySellButton from "../../common/components/BuySellButton";
import SelectionDropDown from "../../common/components/SelectionDropDown";
import LabelInput from "../../common/components/LabelInput";
import LabelTextArea from "../../common/components/LabelTextArea";
import "./ticket.css";

export default function TicketView({ticket, instrument, eventHandler}) {
    return (
          <div id="ticket">
            <form>
              <LabelInput label="Symbol"
                          name="symbol"
                          type="text"
                          value={instrument.symbol}
                          handleOnChange={eventHandler.symbolChange} />
              <LabelInput label="Quantity"
                          name="quantity"
                          type="number"
                          step="5"
                          value={ticket.quantity}
                          handleOnChange={eventHandler.quantityChange} />
              <SelectionDropDown id="orderType"
                                label="Order Type"
                                name="orderType"
                                list={["Market","Limit","Stop","Stop Limit"]}
                                handleOnChange={eventHandler.orderTypeChange} />
              <LabelInput style={ticket.priceStyle}
                          label="Price"
                          name="price"
                          type="number"
                          step="0.1"
                          value={ticket.price}
                          handleOnChange={eventHandler.priceChange} />
             <SelectionDropDown id="expiryType"
                                label="Expiry Type"
                                name="expiryType"
                                list={["Day","GTD","GTC","FOK"]}
                                handleOnChange={eventHandler.expiryTypeChange} />
             <LabelInput style={ticket.expiryDateStyle}
                         label="Expiry Date"
                         name="expiryDate"
                         type="date"
                         step="0.1"
                         value={ticket.expiryDate}
                         handleOnChange={eventHandler.expiryDateChange} />
            <LabelTextArea
                         label="Note"
                         name="note"
                         maxLength="100"
                         value={ticket.note}
                         handleOnChange={eventHandler.noteChange} />

            <div>
              <div id="buySell">
                  <BuySellButton containerId="sellButton"
                                 handleOnClick={eventHandler.handleOnSubmit}
                                 label={instrument.bidPrice}
                                 id="sell"
                                 buttonName="Sell" />
                  <BuySellButton containerId="buyButton"
                                 handleOnClick={eventHandler.handleOnSubmit}
                                 label={instrument.askPrice}
                                 id="buy"
                                 buttonName="Buy" />
              </div>
           </div>
          </form>
         </div>
      )
}
