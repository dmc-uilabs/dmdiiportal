'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabProjectEvents', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-project-events.html',
            scope: {
                source : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, questionToastModel) {
                $element.addClass("tab-projectEvents");


                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

            }
        };
    }]);
