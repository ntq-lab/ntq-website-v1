'use strict';

module.exports = function (array) {
    var arrayLength = array.length,
        temporary,
        index;

    while (arrayLength) {
        index = Math.floor(Math.random() * arrayLength--);
        temporary = array[arrayLength];
        array[arrayLength] = array[index];
        array[index] = temporary;
    }
    return array;
};