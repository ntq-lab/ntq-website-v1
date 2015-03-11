'use strict';
angular.module('backend').factory('API', ['$http', 'Enhance', function ($http, Enhance) {
    return {
        call: function (method, url, data) {
            $('.mark').show();

            data = data || {};
            data._time = new Date().getTime();

            return $http({
                url: Enhance.mount('/api' + url),
                method: method,
                data: data
            }).then(function (res) {
                $('.mark').hide();
                return res.data;
            }, function (err) {
                console.log(err);
            });
        }
    };
} ]);