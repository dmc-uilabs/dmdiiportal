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

                        for(var e in $scope.recentUpdates){
                          var update = $scope.recentUpdates[e];
                            if (update.updateType == "DMDIIMember") {
                              update.parentLink = '/member-page.php#/'+update.parentId
                              update.description = 'New DMDII Member!'
                            } else if (update.updateId == update.parentId) {
                              update.description = 'New Project!'
                            } else {
                              update.parentLink = '/dmdii-project-page.php#/'+update.parentId
                              var updateObject = update.updateType.replace("DMDII", "").replace(/([A-Z])/g, ' $1')
                              update.description = updateObject+" added!"
                            }

                            if (update.updateType == "DMDIIMember") {
                              update.updateTypeDisplay = "MEMBER"
                            } else {
                              update.updateTypeDisplay = "PROJECT"
                            }
                        }

                    });
                };

                $scope.getRecentUpdates();

                // $scope.showDescription = function(item){
                //     item.isShowDescription = (!item.isShowDescription ? true : false);
                // };
            }]
        };
    }]);
