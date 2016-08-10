'use strict';

angular.module('dmc.community.dmc-events',[]).
    directive('dmcEvents', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/community/directives/dmc-events.html',
            scope: {
                widgetTitle: "="
            },
            controller: ["$scope", "dataFactory", "ajax" ,"toastModel", function($scope, dataFactory, ajax, toastModel) {
                $scope.events = [];
                $scope.totalEvents = 0;

                $scope.getEvents = function(){
                    ajax.get(dataFactory.getEvents(),{
                        _limit : 5,
                        _start : 0
                    },function(response){
                        $scope.events = response.data;
                        $scope.totalEvents = $scope.events.length;
                        for(var e in $scope.events){
                            $scope.events[e].date = [moment($scope.events[e].date).format("MMM"),moment($scope.events[e].date).format("D")];
                            $scope.events[e].startTime =$scope.events[e].startTime;
                            $scope.events[e].endTime = $scope.events[e].endTime;
                        }
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });
                };

                $scope.getEvents();

                $scope.showDescription = function(item){
                    item.isShowDescription = (!item.isShowDescription ? true : false);
                };
            }]
        };
    }]);
