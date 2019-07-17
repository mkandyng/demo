import React from "react";
import {getRandomInt} from "../../libs/utils";

export const MAX_MARKET_FEED_INSTRUMENTS = 5;
export const MAX_INSTRUMENTS = 15;
export const MOUSE_OVER_IMAGE = "img/delete_click.png";
export const MOUSE_OUT_IMAGE = "img/delete.png";

/**
 * [retrieveInstrument return an instrument from the list that matches a given symbol]
 * @param  {[Array]} instruments [Array of instrument objects]
 * @param  {[String]} symbol      [symbol property of the instrument object]
 * @return {[Object]}             [An instrument object from the given array]
 */
export function retrieveInstrument(instruments, symbol) {
  return instruments.find(e => e.symbol === symbol);
}

/**
 * [removeInstrument return a new instruments list and not mutate original array]
 * @param  {[Array]} instruments [Array of instrument objects]
 * @param  {[String]} symbol      [symbol property of the instrument object]
 * @return {[Array]}             [Array of the instrument objects that doesn't contain matched symbol]
 */
export function removeInstrument(instruments, symbol) {
  return instruments.filter(e => e.symbol !== symbol);
}

/**
 * [updateInstrument update an instrument from the gaven instrument if symbol ]
 * @param  {[Array]} instruments      [Array of instrument objects]
 * @param  {[Object]} updateInstrument [A new instrument object that we like to replace]
 * @return {[Array]}                  [Array of the instruments with instrument replaced for matched symbol]
 */
export function updateInstrument(instruments, updateInstrument) {
  return instruments.map(
    e => e.symbol === updateInstrument.symbol
    ? updateInstrument
    : e);
}

export function getDeleteId(instrument) {
  return "deleteImg-" + instrument.symbol;
}

/**
 * [generateMarketfeedMovement Given an instrument, generate a new instrument with different prices]
 * @param  {[Object]} instrument [an instrument object]
 * @return {[type]}            [a new instrument object with new adjust price]
 */
export function generateMarketfeedMovement(instrument) {

  // generate a random margin
  const margin = instrument.price * (0.001 * getRandomInt(1, 10));
  const bidAskMargin = instrument.price * (0.001 * getRandomInt(1, 10));
  const newPrice = calNewPrice(instrument.price, margin);
  const chg = (((newPrice - instrument.open) / instrument.open) * 100).toFixed(2);
  const bid = (newPrice - bidAskMargin).toFixed(2);
  const ask = (newPrice + bidAskMargin).toFixed(2);
  const open = instrument.open * 1.0;
  const last = instrument.price * 1.0;

  return {
    delete: <img id={getDeleteId(instrument)} src={MOUSE_OUT_IMAGE} width={15} height={15} alt={"delete"}/>,
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
}

/**
 * [flashPriceUpdate trigger an update of marketfeed price of one of the instruments]
 * @param  {[Array]} marketfeedInstruments      [Array of instruments in the marketfeed]
 * @param  {[Function]} updateMarketfeedInstrument [Action to change state of marketfeed]
 * @return {[Boolean]}                            [Inform if update successful or not]
 */
export function flashPriceUpdate(marketfeedInstruments, updateMarketfeedInstrument) {
  if (marketfeedInstruments.length > 0) {
    const instrumentIndex = getRandomInt(0, marketfeedInstruments.length - 1);
    const randomInstrument = marketfeedInstruments[instrumentIndex];
    updateMarketfeedInstrument({
      ...randomInstrument,
      bid: "",
      ask: ""
    });
    setTimeout(() => updateMarketfeedInstrument(generateMarketfeedMovement(randomInstrument)), 500);
    return true;
  }
  return false;
};

function calNewPrice(price, margin) {
  return Math.round(Math.random()) === 0
    ? price - margin
    : price + margin;
}

function upDownPrice(price, previousPrice, data) {
  let priceUpDown = "priceUp";
  if (price < previousPrice) {
    priceUpDown = "priceDown";
  }
  return <span className={priceUpDown}>{data}</span>;
}
