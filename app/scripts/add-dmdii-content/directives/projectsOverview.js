'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabProjectsOverview', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-projects-overview.html',
            scope: {
                source: "=",
            }, controller: function($scope, $element, $attrs, dataFactory, ajax) {
                $element.addClass("tab-projectsOverview");

                $scope.documents = [];

                $scope.$watch('documents', function(newVal) {
                    console.log($scope.documents, newVal)
                });
                //$scope.source.dateJoined = moment($scope.source.dateJoined).format("MM/DD/YYYY");

            }
        };
    }]);
