export const getDateString = function (date, format) {
    const dateTimeMills = date.toISOString();
    if(format === "dateOnly") {
       return dateTimeMills.substr(0,10);
    } else if(format === "dateTimeFormat") {
       return dateTimeMills.replace("T"," ").replace("Z","");
    }
};

export const toggleOpacity = function (selectedValue, opacityValue, equalsCompare) {
    if(equalsCompare) {
        return selectedValue === opacityValue? "0.5": "1.0";
    } else {
        return selectedValue === opacityValue? "1.0": "0.5";
    }
};

export const getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};