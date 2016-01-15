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
                    ajax.on(dataFactory.getAnnouncements(),{
                        limit : 5,
                        offset : 0
                    },function(data){
                        if(!data.error){
                            $scope.announcements = data.result;
                            for(var a in $scope.announcements){
                                $scope.announcements[a].created_at = moment($scope.announcements[a].created_at).format("MMM Do YYYY");
                            }
                            $scope.totalAnnouncements = data.count;
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        }else{
                            toastModel.showToast("error", data.error);
                        }
                    },function(){
                        toastModel.showToast("error", "Error. getAnnouncements() fail");
                    });
                };

                $scope.getAnnouncements();
            }]
        };
    }]);
