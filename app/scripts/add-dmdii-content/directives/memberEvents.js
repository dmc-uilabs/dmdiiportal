'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabMemberEvents', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-member-events.html',
            scope: {
                source : "=",
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, questionToastModel) {
                $element.addClass("tab-memberEvents");

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            }
        };
    }]);
