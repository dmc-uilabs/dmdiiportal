'use strict';
angular.module('dmc.company-profile').
    directive('tabMembership', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-membership.html',
            scope: {
                source: "=",
                changedValue : "=",
                changes : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax) {
                $element.addClass("tab-membership");

                //$scope.source.dateJoined = moment($scope.source.dateJoined).format("MM/DD/YYYY");

                $scope.categoriesTiers = [
                    {
                        id : 1,
                        title : "Tier 4 Academic / Nonprofit"
                    }
                ];

            }
        };
    }]);