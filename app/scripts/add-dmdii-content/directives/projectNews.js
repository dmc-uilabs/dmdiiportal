'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabProjectNews', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-project-news.html',
            scope: {
                source : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax) {
                $element.addClass("tab-projectNews");
                
                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

            }
        };
    }]);
