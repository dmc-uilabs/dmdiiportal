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
                        limit : 10
                    },function(response){
                        $scope.recentUpdates = response.data;
                        $scope.totalRecentUpdates = $scope.recentUpdates.length;

                        for(var e in $scope.recentUpdates){
                          var update = $scope.recentUpdates[e];
                            if (update.updateType == "DMDIIMember") {
                              getOrgMemberId(update.parentId);
                              update.parentLink = '/member-page.php#/'
                              update.description = 'New DMDII Member!'
                              update.updateTypeDisplay = "MEMBER"
                              update.updateTypeDisplayIcon = "people"
                            } else {
                              update.parentLink = '/dmdii-project-page.php#/'
                              update.description = returnProjectUpdateDescription(update)
                              update.updateTypeDisplay = "PROJECT"
                              update.updateTypeDisplayIcon = "folder_open"
                            }
                        }

                    });
                };

                function returnProjectUpdateDescription(update){
                  if (update.updateType == "DMDIIProject") {
                    if (update.attributeName) {
                      return update.attributeName.replace(/([A-Z])/g, ' $1')+" updated!"
                    } else {
                      return "New Project!"
                    }
                  } else {
                    return update.updateType.replace("DMDII", "").replace(/([A-Z])/g, ' $1')+" added!"
                  }
                }

                function getOrgMemberId(companyId){
                  ajax.get(dataFactory.getOrganization(companyId), {}, function(response) {
                    update.parentId = response.data.dmdiiMemberId;
                  });
                }

                $scope.getRecentUpdates();

                // $scope.showDescription = function(item){
                //     item.isShowDescription = (!item.isShowDescription ? true : false);
                // };
            }]
        };
    }]);
