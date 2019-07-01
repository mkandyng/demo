import { getDateString } from "../../../libs/utils";

export default function validateOrder(ticket, instrument) {
    if(ticket.quantity === 0) {
        alert("Quantity must be greater than 0");
        return false;
    }

    if(ticket.expiryType === "GTD") {
        var today = new Date();
        today.setHours(1,0,0,0);
        var inputDate = new Date(ticket.expiryDate);
        if(inputDate < today) {
            alert("GTD date must be greater or equals to today [" + getDateString(today, "dateOnly") + "]");
            return false;
        }
    }

    if(ticket.orderType !== "Market") {
        if(Math.abs(ticket.price - instrument.price) > (instrument.price * 0.05)) {
            alert("Price " + ticket.price + " is outside 5% of midPrice [" + instrument.price.toFixed(2) + "]");
            return false;
        }
    }

    return true;
}
