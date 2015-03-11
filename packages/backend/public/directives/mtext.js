'use strict';

angular.module('backend').directive('mtext', ['$timeout', 'Global', function ($timeout, Global) {
    return {
        templateUrl: '/backend/views/mtext.html',
        scope: {
            name: '=ngName',
            ngChange: '&ngValueChange'
        },
        restrict: 'E',
        controller: ['$scope', function ($scope) {
            $scope.selectedLocale = Global.defaultLocale;
            $scope.languages = Global.languages;

            $scope.onChange = function () {
                $scope.ngChange();
            };
        } ]
    };
} ]);