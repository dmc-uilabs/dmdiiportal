'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabQuicklinks', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-quicklinks.html',
            scope: {
                source : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, questionToastModel) {
                $element.addClass("tab-quicklinks");

                $scope.quicklink = {};
                $scope.linkType = 'text';
                $scope.document = [];
$scope.$watchCollection('document', function(newVal) {
    console.log(newVal)
})
                function apply() {
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            }
        };
    }]);
