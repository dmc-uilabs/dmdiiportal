'use strict';

angular.module('dmc.individual-discussion', [
	'dmc.configs.ngmaterial',
	'ngMdIcons',
	'ui.router',
	'dmc.ajax',
	'dmc.data',
	'dmc.common.header',
	'dmc.common.footer',
	'dmc.model.toast-model'
])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
		$stateProvider.state('individual-discussion', {
			url: '/:discussionId',
			templateUrl: 'templates/individual-discussion/individual-discussion.html',
			controller: 'individual-discussionController'
		}).state('edit-discussion', {
            url: '/:discussionId/edit',
            templateUrl: 'templates/individual-discussion/edit-discussion.html',
            controller: 'edit-discussionController'
        });
		$urlRouterProvider.otherwise('/1');
	})
	.controller('individual-discussionController', [
        '$scope',
        '$stateParams',
        'ajax',
        'dataFactory',
        '$mdDialog',
        '$mdToast',
        '$rootScope',
        'DMCUserModel',
        'toastModel',
        function ($scope,
                  $stateParams,
                  ajax,
                  dataFactory,
                  $mdDialog,
                  $mdToast,
                  $rootScope,
                  DMCUserModel,
                  toastModel) {

            $scope.followFlag = null;
            $scope.userData = $rootScope.userData;
            $scope.NewComment = "";
            $scope.discussion = null;
            $scope.flagReviewFlag = false;

            $scope.userData = DMCUserModel.getUserData();
            $scope.userData.then(function(result) {  // this is only run after $http completes
                $scope.userData = result;
                init();
            });

            function init(){
                //load Discussion
                ajax.on(
                    dataFactory.getIndividualDiscussion($stateParams.discussionId), {},
                    function(data){
                        $scope.discussion = data;
                        if($scope.discussion) {
                            $scope.loadTags();
                            $scope.loadComments();
                            isFollowed();
                        }
                        apply();
                    }, function(){
                        toastModel.showToast("error", "Fail Load IndividualDiscussion");
                    }
                );

                // load tags
                $scope.loadTags = function(){
                    ajax.on(dataFactory.getDiscussionTags($stateParams.discussionId), {
                        "_order" : "DESC",
                        "_sort" : "id"
                    }, function(data){
                        $scope.discussion.tags = data;
                        apply();
                    }, function(){
                        toastModel.showToast("error", "Unable get tags");
                    },"GET");
                };

                // load comments
                $scope.loadComments = function(){
                    ajax.on(dataFactory.getDiscussionComments($scope.discussion.id), {
                        "_order" : "DESC",
                        "_sort" : "created_at"
                    }, function(response){
                        $scope.discussion.comments = {};
                        $scope.discussion.comments.items = response.reverse();
                        for (var c in $scope.discussion.comments.items) {
                            $scope.discussion.comments.items[c].created_at = moment($scope.discussion.comments.items[c].created_at).format('MM/DD/YYYY, h:mm A');
                            if ($scope.userData.accountId == $scope.discussion.comments.items[c].accountId) $scope.discussion.comments.items[c].isOwner = true;
                        }
                        apply();
                    }, function(){
                        toastModel.showToast("error", "Unable get comments");
                    }, "GET");
                };

                //load realted Disscussion
                ajax.on(
                    dataFactory.getIndividualDiscussions(),{
                        "_limit" : 5
                    }, function(data){
                        $scope.realtedDiscussions = data;
                        apply();
                    }, function(){
                        toastModel.showToast("error", "Fail Load IndividualDiscussion");
                    }
                );


                $scope.follow = function(){
                    if(!$scope.followFlag) {
                        ajax.create(dataFactory.followDiscussion(), {
                            "accountId": $scope.userData.accountId,
                            "individual-discussionId": $scope.discussion.id
                        }, function (response) {
                            $scope.followFlag = response.data;
                            apply();
                        });
                    }else{
                        ajax.delete(dataFactory.unfollowDiscussion($scope.followFlag.id), {},
                            function (response) {
                                $scope.followFlag = null;
                                apply();
                            }
                        );
                    }
                };

                //Like review
                $scope.Like = function(item){
                    if(item.userRatingReview[$scope.userData.displayName] == "none"){
                        item.like++;
                        item.userRatingReview[$scope.userData.displayName] = 'like';
                    }else if(item.userRatingReview[$scope.userData.displayName] == 'like'){
                        item.like--;
                        item.userRatingReview[$scope.userData.displayName] = "none";
                    }else{
                        item.like++;
                        item.userRatingReview[$scope.userData.displayName] = 'like';
                        item.dislike--;
                    }
                    ajax.on(
                        dataFactory.addDiscussionLikeDislike(),
                        {
                            commentId: item.id,
                            like: item.like,
                            dislike: item.dislike,
                            ratingComment: item.userRatingReview[$scope.userData.displayName],
                            userLogin: $scope.userData.displayName
                        },
                        function(data){
                        },
                        function(){
                        },
                        "POST"
                    );
                };

                //DisLike review
                $scope.DisLike = function(item){
                    if(item.userRatingReview[$scope.userData.displayName] == "none"){
                        item.dislike++;
                        item.userRatingReview[$scope.userData.displayName] = 'dislike';
                    }else if(item.userRatingReview[$scope.userData.displayName] == 'dislike'){
                        item.dislike--;
                        item.userRatingReview[$scope.userData.displayName] = "none";
                    }else{
                        item.dislike++;
                        item.userRatingReview[$scope.userData.displayName] = 'dislike';
                        item.like--;
                    }
                    ajax.on(
                        dataFactory.addDiscussionLikeDislike(),
                        {
                            commentId: item.id,
                            like: item.like,
                            dislike: item.dislike,
                            ratingComment: item.userRatingReview[$scope.userData.displayName],
                            userLogin: $scope.userData.displayName
                        },
                        function(data){},
                        function(){},
                        "POST"
                    );
                };

                //Submit Leave A Review form
                $scope.Submit = function(){
                    ajax.on(
                        dataFactory.addCommentIndividualDiscussion(), {
                            "individual-discussionId": $stateParams.discussionId,
                            "full_name": $scope.userData.displayName,
                            "accountId": $scope.userData.accountId,
                            "avatar": "/images/carbone.png",
                            "text": $scope.newComment,
                            "created_at": moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
                            "userRatingReview": {
                                "DMC Member": "like"
                            },
                            "like": 0,
                            "dislike": 0
                        },
                        function(data){
                            $scope.newComment = "";
                            data.created_at = moment(data.created_at).format('MM/DD/YYYY, h:mm A');
                            data.isOwner = true;
                            $scope.discussion.comments.items.push(data);
                            apply();
                            $('.md-char-counter').text('0/1000');
                        }, function(){
                            toastModel.showToast("error", "Fail add comment");
                        }, "POST"
                    );
                };

                $scope.flagPost = function(index){
                    $scope.flagReviewFlag = ( $scope.flagReviewFlag === index ? false : index );
                };

                $scope.Cancel = function(){
                    $scope.flagReviewFlag = false;
                };

                $scope.SubmitReview = function(NewReview){
                    $scope.flagReviewFlag = false;
                };

                $scope.createDiscussion = function(ev){
                    $(window).scrollTop(0);
                    $mdDialog.show({
                        controller: "ComposeDiscussionController",
                        templateUrl: "templates/individual-discussion/compose-discussion.html",
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: {
                            products: $scope.allServices
                        },
                        clickOutsideToClose:true
                    }).then(function() {}, function() {});
                }
            }

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

            function isFollowed(){
                ajax.get(dataFactory.isUserFollowedDiscussion($scope.userData.accountId),{
                    "individual-discussionId": $scope.discussion.id
                },function(response){
                    $scope.followFlag = (response.data && response.data.length > 0 && response.data[0].id ? response.data[0] : null);
                    apply();
                })
            }
	    }
    ]
);
