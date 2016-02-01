'use strict';

angular.module('dmc.community.discussions',[]).
    directive('communityDiscussions', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/community/directives/discussions.html',
            scope: {
                widgetTitle: "="
            },
            controller: ["$scope", "dataFactory", "ajax" ,"toastModel", function($scope, dataFactory, ajax, toastModel) {
                $scope.limit = 3;

                $scope.discussions = [];
                $scope.totalDiscussions = 0;

                $scope.getDiscussions = function(){
                    ajax.get(dataFactory.getDiscussions(),{
                        _limit : $scope.limit,
                        _sort : "created_at",
                        _order : "DESC"
                    },function(response){
                        $scope.discussions = response.data;
                        $scope.totalDiscussions = $scope.discussions.length;
                        for(var index in $scope.discussions){
                            $scope.discussions[index].created_at = moment($scope.discussions[index].created_at,'DD-MM-YYYY HH:mm:ss').format("MM/DD/YY hh:mm A");
                        }
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });
                };

                $scope.getDiscussions();
            }]
        };
    }]);
