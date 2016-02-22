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
                    //ajax.get(dataFactory.getIndividualDiscussions(),{
                    //    _limit : 5,
                    //    _start : 0
                    //},function(response){
                    //    $scope.announcements = response.data;
                    //    $scope.totalAnnouncements = $scope.announcements.length;
                    //    for(var a in $scope.announcements){
                    //        $scope.announcements[a].created_at = moment($scope.announcements[a].created_at).format("MM/DD/YYYY");
                    //    }
                    //    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    //});

                    ajax.get(dataFactory.getIndividualDiscussions(), {
                        "_order" : "DESC",
                        "_sort" : "id"
                    }, function (response) {
                        $scope.totalAnnouncements = response.data.length;
                        $scope.announcements = response.data;
                        var ids = $.map($scope.announcements,function(x){ return x.id; });
                        ajax.get(dataFactory.addCommentIndividualDiscussion(),{
                            "individual-discussionId" : ids,
                            "_order" : "DESC",
                            "_sort" : "id"
                        },function(res){
                            for(var i in $scope.announcements){
                                $scope.announcements[i].created_at_format = moment(new Date($scope.announcements[i].created_at)).format("MM/DD/YYYY");
                                $scope.announcements[i].replies = 0;
                                for(var j in res.data){
                                    if($scope.announcements[i].id == res.data[j]["individual-discussionId"]){
                                        $scope.announcements[i].replies++;
                                        $scope.announcements[i].last = res.data[j];
                                        $scope.announcements[i].last.created_at_format = moment(new Date($scope.announcements[i].last.created_at)).format("MM/DD/YYYY");
                                        if($scope.announcements[i].last.isPosted == null){
                                            $scope.announcements[i].last.isPosted = true;
                                        }else if($scope.announcements[i].last.isPosted == true){
                                            $scope.announcements[i].last.isPosted = false;
                                        }
                                    }
                                }
                            }
                            $scope.announcements.sort(function(a,b){ return b.last.created_at - a.last.created_at; });
                            //$scope.discussions.splice($scope.limit,$scope.discussions.length);
                        });
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });
                };

                $scope.getAnnouncements();
            }]
        };
    }]);
