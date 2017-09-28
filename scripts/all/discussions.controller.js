'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllDiscussionsController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'projectData',
        'previousPage',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    projectData,
                    previousPage,
                    dataFactory) {

            $scope.prevPage = previousPage;

            // comeback to the previous page
            $scope.previousPage = previousPage.get();

            $("title").text("View All Discussions");
            if($scope.previousPage.tag != "my-projects"){
                $scope.previousPage = {
                    tag : "my-projects",
                    title: "Back to My Projects",
                    url: location.origin+'/my-projects.php'
                }
            }
            $(".bottom-header .active-page").removeClass("active-page");
            $(".projects-header-button").addClass("active-page");

            $scope.projectData = projectData;
            $scope.projectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : null;
            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : null;

            if($scope.projectData && $scope.projectData.id && $scope.projectId) {
                $scope.discussions = [];
                $scope.order = "DESC";
                $scope.sort = "text";

                $scope.types = [
                    {
                        tag: "all",
                        name: "All"
                    },
                    {
                        tag: "following",
                        name: "Followed"
                    }, {
                        tag: "follow-people",
                        name: "People I Follow"
                    },{
                        tag: "popular",
                        name: "Popular"
                    }
                ];

                $scope.getDiscussions = function () {
                    ajax.get(dataFactory.getIndividualDiscussions(), {
                        "_order" : "DESC",
                        "projectId" : $scope.projectId,
                        title_like: $scope.searchModel,
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
                            //$scope.discussions.splice($scope.limit,$scope.discussions.length);
                        });
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });
                };
                $scope.getDiscussions();

                $scope.onOrderChange = function (order) {
                    //$scope.sort = order;
                    //$scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
                    //$scope.getDiscussions();
                };

                var apply = function () {
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                $scope.submit = function (text) {
                    $scope.searchModel = text;
                    var dataSearch = $.extend(true, {}, $stateParams);
                    dataSearch.text = $scope.searchModel;
                    $state.go('discussions', dataSearch, {reload: true});
                };

                $scope.changedType = function (type) {
                    var dataSearch = $.extend(true, {}, $stateParams);
                    dataSearch.type = type;
                    $state.go('discussions', dataSearch, {reload: true});
                };
            }
        }
    ]
);