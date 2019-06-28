import React from "react";
import { getRandomInt } from "../../libs/utils";

function calNewPrice(price,margin) {
        return Math.round(Math.random()) === 0?price-margin:price+margin;
}

function upDownPrice(price, previousPrice, data) {
    let priceUpDown = "priceUp";
    if(price < previousPrice) {
        priceUpDown = "priceDown";
    }
    return <span className={priceUpDown}>{data}</span>;
}

export default function generateMarketfeedMovement(instrument) {

    // generate a random margin
    const margin = instrument.price * (0.001 * getRandomInt(1,10));
    const bidAskMargin = instrument.price * (0.001 * getRandomInt(1,10));
    const newPrice = calNewPrice(instrument.price,margin);
    const chg = (((newPrice - instrument.open)/instrument.open) * 100).toFixed(2);
    const bid = (newPrice - bidAskMargin).toFixed(2);
    const ask = (newPrice + bidAskMargin).toFixed(2);
    const open = instrument.open * 1.0;
    const last = instrument.price * 1.0;

    return {
        delete:<img src="img/delete.png"
                  width="15"
                  height="15"
                  alt="delete"/>,
        price: newPrice,
        bidPrice: bid,
        askPrice: ask,
        symbol: instrument.symbol,
        name: instrument.name,
        currency: instrument.currency,
        last: last.toFixed(2),
        open: open.toFixed(2),
        bid: upDownPrice(newPrice, open, bid),
        ask: upDownPrice(newPrice, open, ask),
        chg: upDownPrice(newPrice, open, chg + "%")
    };
};
