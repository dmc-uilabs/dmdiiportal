'use strict';
angular.module('dmc.company-profile').
    directive('tabMembership', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-membership.html',
            scope: {
                source: "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax) {
                $element.addClass("tab-membership");

            }
        };
    }]);
