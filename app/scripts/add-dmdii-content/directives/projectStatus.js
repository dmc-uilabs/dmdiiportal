'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabProjectStatus', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-project-status.html',
            scope: {
                source: "=",
            }, controller: function($scope, $element, $attrs, dataFactory, ajax) {
                $element.addClass("tab-projectsStatus");

                $scope.doc = {};

                //$scope.source.dateJoined = moment($scope.source.dateJoined).format("MM/DD/YYYY");

            }
        };
    }]);
