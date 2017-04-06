'use strict';

angular.module('dmc.community.discussions',[
    'ngCookies',
    'dmc.model.previous-page',
    'dmc.widgets.rich-text'
]).
    directive('communityDiscussions', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/community/directives/discussions.html',
            scope: {
                widgetTitle: "=",
                widgetType: "="
            },
            controller: ["$scope", "dataFactory", "ajax" ,"toastModel", "$cookies","$location","previousPage", "$mdDialog",
            function($scope, dataFactory, ajax, toastModel, $cookies, $location,previousPage, $mdDialog) {
                $scope.limit = 3;

                $scope.previousPage = previousPage;
                $scope.discussions = [];
                $scope.totalDiscussions = 0;

                $scope.createDiscussion = function(ev){
                    $(window).scrollTop(0);
                        $mdDialog.show({
                            controller: "ComposeDiscussionController",
                            templateUrl: "templates/individual-discussion/compose-discussion.html",
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: {
                                 project_id: null
                            },
                            clickOutsideToClose:true
                        })
                        .then(function() {
                        }, function() {
                        });
                }

                $scope.getDiscussions = function(){
                        ajax.get(dataFactory.getIndividualDiscussions(), {
                            "_order" : "DESC",
                            "_sort" : "id"
                        }, function (response) {
                            $scope.totalDiscussions = response.data.length;
                            $scope.discussions = response.data;
                            var ids = $.map($scope.discussions,function(x){ return x.id; });
                            ajax.get(dataFactory.addCommentIndividualDiscussion(),{
                                "individual-discussionId" : ids,
                                "_order" : "DESC",
                                "_sort" : "id",
                                "commentId": 0
                            },function(res){
                                for(var i in $scope.discussions){
                                    $scope.discussions[i].created_at_format = moment(new Date($scope.discussions[i].created_at)).format("MM/DD/YYYY");
                                    $scope.discussions[i].replies = 0;
                                    for(var j in res.data){
                                        if($scope.discussions[i].id == res.data[j]["individual-discussionId"]){
                                            $scope.discussions[i].replies++;
                                            $scope.discussions[i].last = res.data[j];
                                            $scope.discussions[i].last.created_at_format = moment(new Date($scope.discussions[i].last.created_at)).format("MM/DD/YYYY");
                                            if($scope.discussions[i].isPosted == null){
                                                $scope.discussions[i].isPosted = true;
                                            }else if($scope.discussions[i].isPosted == true){
                                                $scope.discussions[i].isPosted = false;
                                            }
                                        }
                                    }
                                    if($scope.discussions[i].replies > 0) $scope.discussions[i].replies--;
                                    if($scope.discussions[i].isPosted == null) $scope.discussions[i].isPosted = true;
                                }
                                $scope.discussions.sort(function(a,b){ return b.last.created_at - a.last.created_at; });
                                if($scope.limit < $scope.discussions.length ) $scope.discussions.splice($scope.limit,$scope.discussions.length);
                            });
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        });
                };

                $scope.getDiscussions();

                $scope.openDiscussion = function(e){
                    e.preventDefault();
                    $cookies.put('previousPage', $location.$$absUrl);
                    window.location = location.origin+$(e.currentTarget).attr("href");
                };
            }]
        };
    }]);
