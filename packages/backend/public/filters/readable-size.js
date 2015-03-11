'use strict';

angular.module('backend').filter('readableSize', [function () {
    var sizeUnits = [{ u: 'B', f: 0 }, { u: 'KB', f: 0 }, { u: 'MB', f: 1 }, { u: 'GB', f: 2 }, { u: 'TB', f: 2}];

    return function (input) {
        if (isNaN(input)) {
            return input;
        }

        var index = 0;
        while (input > 1024) {
            input = input / 1024;
            index++;
        }

        return input.toFixed(sizeUnits[index].f) + ' ' + sizeUnits[index].u;
    };
} ]);