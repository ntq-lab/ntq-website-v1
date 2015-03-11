'use strict';
angular.module('backend').directive('resize', ['$timeout', function ($timeout) {
    function resize(text) {
        $timeout(function () {
            text.style.height = 'auto';
            text.style.height = (text.scrollHeight + 2) + 'px';
        });
    }

    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            element.bind('input', function () {
                resize(this);
            });

            resize(element[0]);
        }
    };
} ]);