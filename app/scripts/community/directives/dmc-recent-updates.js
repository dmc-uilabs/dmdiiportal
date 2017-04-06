'use strict';

angular.module('dmc.community.dmc-recent-updates',[]).
    directive('dmcRecentUpdates', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/community/directives/dmc-recent-updates.html',
            scope: {
                widgetTitle: "="
            },
            controller: ["$scope", "dataFactory", "ajax" ,"toastModel", function($scope, dataFactory, ajax, toastModel) {
                $scope.recentUpdates = [];
                $scope.totalRecentUpdates = 0;

                $scope.getRecentUpdates = function(){
                    ajax.get(dataFactory.getRecentUpdates(),{
                        limit : 3
                    },function(response){
                        $scope.recentUpdates = response.data;
                        $scope.totalRecentUpdates = $scope.recentUpdates.length;
                        // for(var e in $scope.recentUpdates){
                        //     $scope.recentUpdates[e].date = [moment($scope.recentUpdates[e].date).format("MMM"),moment($scope.recentUpdates[e].date).format("D")];
                        //     $scope.recentUpdates[e].startTime =$scope.recentUpdates[e].startTime;
                        //     $scope.recentUpdates[e].endTime = $scope.recentUpdates[e].endTime;
                        // }
                        // if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });
                };

                $scope.getRecentUpdates();

                // $scope.showDescription = function(item){
                //     item.isShowDescription = (!item.isShowDescription ? true : false);
                // };
            }]
        };
    }]);
