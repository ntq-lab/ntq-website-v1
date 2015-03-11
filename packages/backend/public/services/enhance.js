'use strict';
angular.module('backend').factory('Enhance', ['Global', function (Global) {
    return {
        mount: function (url) {
            return Global.mount + url;
        }
    };
} ]);