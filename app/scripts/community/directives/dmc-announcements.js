'use strict';

angular.module('dmc.community.dmc-announcements',[]).
    directive('dmcAnnouncements', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/community/directives/dmc-announcements.html',
            scope: {
                widgetTitle: "="
            },
            controller: ["$scope", "dataFactory", "ajax" ,"toastModel", function($scope, dataFactory, ajax, toastModel) {
                $scope.announcements = [];
                $scope.totalAnnouncements = 0;

                $scope.getAnnouncements = function(){
                    ajax.get(dataFactory.getAnnouncements(),{
                        _limit : 5,
                        _start : 0,
                        _embed : "announcement_comments"
                    },function(response){
                        $scope.announcements = response.data;
                        $scope.totalAnnouncements = $scope.announcements.length;
                        for(var a in $scope.announcements){
                            $scope.announcements[a].created_at = moment($scope.announcements[a].created_at).format("MMM Do YYYY");
                        }
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });
                };

                $scope.getAnnouncements();
            }]
        };
    }]);
