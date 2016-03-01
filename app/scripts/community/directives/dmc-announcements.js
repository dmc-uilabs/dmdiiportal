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
                var limit = 5;

                $scope.getAnnouncements = function(){
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
                            "_sort" : "id",
                            "commentId": 0
                        },function(res){
                            for(var i in $scope.announcements){
                                $scope.announcements[i].created_at_format = moment(new Date($scope.announcements[i].created_at)).format("MM/DD/YYYY");
                                $scope.announcements[i].replies = 0;
                                for(var j in res.data){
                                    if($scope.announcements[i].id == res.data[j]["individual-discussionId"]){
                                        $scope.announcements[i].replies++;
                                        $scope.announcements[i].last = res.data[j];
                                        $scope.announcements[i].last.created_at_format = moment(new Date($scope.announcements[i].last.created_at)).format("MM/DD/YYYY");
                                        if($scope.announcements[i].isPosted == null){
                                            $scope.announcements[i].isPosted = true;
                                        }else if($scope.announcements[i].isPosted == true){
                                            $scope.announcements[i].isPosted = false;
                                        }
                                    }
                                }
                                if($scope.announcements[i].isPosted == null) $scope.announcements[i].isPosted = true;
                            }
                            $scope.announcements.sort(function(a,b){ return b.last.created_at - a.last.created_at; });
                            if(limit < $scope.announcements.length) $scope.announcements.splice(limit,$scope.announcements.length);
                        });
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });
                };

                $scope.getAnnouncements();
            }]
        };
    }]);
