/**
 * [getDateString resolve display date format]
 * @param  {[Date]} date   [a given date object]
 * @param  {[String]} format [Optional to specified date format]
 * @return {[String]}        [formatted String of a given date]
 */
export function getDateString(date, format) {
    const dateTimeMills = date.toISOString();
    if(format === "dateOnly") {
       return dateTimeMills.substr(0,10);
    } else if(format === "dateTimeFormat") {
       return dateTimeMills.replace("T"," ").replace("Z","");
    } else {
      return dateTimeMills;
    }
};

/**
 * [toggleOpacity toggle display opacity]
 * @param  {[String]} selectedValue [A given selected value used for comparison]
 * @param  {[String]} opacityValue  [A given opacityValue to switch opacity]
 * @param  {[Boolean]} equalsCompare [Should the comparison be equal or not equal compare]
 * @return {[Number]}               [Opacity ratio]
 */
export function toggleOpacity(selectedValue, opacityValue, equalsCompare) {
    if(equalsCompare) {
        return selectedValue === opacityValue? 0.5: 1.0;
    } else {
        return selectedValue === opacityValue? 1.0: 0.5;
    }
};

/**
 * [getRandomInt determine a random value between min and max inclusive]
 * @param  {[Number]} min [min value]
 * @param  {[Number]} max [max value]
 * @return {[Number]}     [a value between the min/max range inclusive]
 */
export function getRandomInt(min, max) {
    if(min > max) {
      throw new RangeError("The argument min is must be less than or equals to max, min[" + min + "],max[" + max +"].");
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * [roundValue round number to a given specification]
 * @param  {[Number]} value         [a given number to be rounded]
 * @param  {[Number]} roundingConst [a constant use to determine rounding effects, i.e. 100 = 2 decimals]
 * @return {[Number]}               [A value that s rounded to the given rounding constant]
 */
export function roundValue(value, roundingConst) {
    return Math.round(value * roundingConst)/roundingConst;
}

/**
 * [padDigits pad a given number with 0 prefix to specified number of characters]
 * @param  {[Number]} number [a given number value]
 * @param  {[Number]} digits [number of characters length]
 * @return {[String]}        [new padded value]
 */
export function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

export function transformTimeSeries(timeSeries, maxPredicate, minPredicate) {
  return {
      chartData: timeSeries,
      maxValue: Math.max.apply(Math, timeSeries.map(maxPredicate)),
      minValue: Math.min.apply(Math, timeSeries.map(minPredicate))
  }
}

export function retrieveInstrument(instruments, symbol) {
    return instruments.find(e => e.symbol === symbol);
}

export function removeInstrument(instruments, symbol) {
    return instruments.filter(e => e.symbol !== symbol);
}

export function updateInstrument(instruments, updateInstrument) {
    return instruments.map(e => e.symbol === updateInstrument.symbol ? updateInstrument: e);
}
