'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllAnnouncementsController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'previousPage',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    previousPage,
                    dataFactory) {

            $scope.prevPage = previousPage;

            // comeback to the previous page
            $scope.previousPage = previousPage.get();
            if($scope.previousPage.tag != "community"){
                $scope.previousPage = {
                    tag : "community",
                    title: "Back to Community",
                    url: previousPage
                }
            }
            $(".bottom-header .active-page").removeClass("active-page");
            $(".community-header-button").addClass("active-page");

            $("title").text("View All Announcements");

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : null;

            
            $scope.announcements = [];
            $scope.order = "DESC";
            $scope.sort = "title";

            $scope.types = [
                {
                    tag: "announcements",
                    name: "Announcements"
                }
            ];

            var getUser = function(announcement){
            	ajax.get(dataFactory.getAccount(announcement.accountId), {},
            		function(response){
            			announcement['full_name'] = response.data.displayName;
            		}
            	);
            };

            var getCreated_By = function(announcement, id){
            	ajax.get(dataFactory.getAccount(announcement.accountId), {},
            		function(response){
            			announcement['latest-post']['created-by'] = response.data.displayName;
            		}
            	);
            };

            var getComments = function(announcement){
				ajax.get(dataFactory.getAnnouncementsComments(announcement.id), {
					"_sort": "created_at",
					"_order": "DESC"
				},
            		function(response){
            			announcement['replies'] = response.data.length;
            			if (response.data.length !== 0) {
            				announcement['latest-post']= {}
            				announcement['latest-post']['created-at'] = moment(response.data[0].created_at).format("MM/DD/YYYY hh:mm A");
							getCreated_By(announcement, response.data[0].id);
            			};
            		}
            	);
            }

            $scope.getAnnouncements = function () {
                ajax.get(dataFactory.getIndividualDiscussions(), {
                    "_order" : "DESC",
                    title_like: $scope.searchModel,
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
                                    if($scope.announcements[i].last.isPosted == null){
                                        $scope.announcements[i].last.isPosted = true;
                                    }else if($scope.announcements[i].last.isPosted == true){
                                        $scope.announcements[i].last.isPosted = false;
                                    }
                                }
                            }
                            if($scope.announcements[i].replies > 0) $scope.announcements[i].replies--;
                        }
                        $scope.announcements.sort(function(a,b){ return b.last.created_at - a.last.created_at; });
                        //$scope.discussions.splice($scope.limit,$scope.discussions.length);
                    });
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                });
            };
            $scope.getAnnouncements();

            $scope.onOrderChange = function (order) {
                //$scope.sort = order;
                //$scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
                //$scope.getAnnouncements();
            };

            var apply = function () {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.submit = function (text) {
                $scope.searchModel = text;
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.text = $scope.searchModel;
                $state.go('announcements', dataSearch, {reload: true});
            };

            $scope.changedType = function (type) {
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.type = type;
                $state.go('announcements', dataSearch, {reload: true});
            };
        }
    ]
);