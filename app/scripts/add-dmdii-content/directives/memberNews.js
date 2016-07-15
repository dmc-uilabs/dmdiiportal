'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabMemberNews', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-member-news.html',
            scope: {
                source : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax) {
                $element.addClass("tab-memberNews");

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

            }
        };
    }]);
