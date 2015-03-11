'use strict';
angular.module('backend.category').factory('Category', ['API', function (API) {
    return {
        getAll: function () {
            return API.call('get', '/categories').then(function (data) {
                return data.categories;
            });
        },
        create: function () {
            return API.call('post', '/category').then(function (data) {
                return data.category;
            });
        },
        remove: function (category) {
            return API.call('delete', '/category/' + category._id);
        },
        save: function (category) {
            return API.call('put', '/category/' + category._id, category).then(function (data) {
                return data.category;
            });
        }
    };
} ]);