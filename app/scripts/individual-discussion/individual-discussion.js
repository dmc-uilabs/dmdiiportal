'use strict';

angular.module('dmc.individual-discussion', [
	'dmc.configs.ngmaterial',
	'ngMdIcons',
	'ui.router',
	'dmc.ajax',
	'dmc.data',
	'dmc.common.header',
	'dmc.common.footer',
	'dmc.model.toast-model',
])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
		$stateProvider.state('individual-discussion', {
			url: '/:discussionId',
			templateUrl: 'templates/individual-discussion/individual-discussion.html',
			controller: 'individual-discussionController'
		});
		$urlRouterProvider.otherwise('/1');
	})
	.controller('individual-discussionController', ['$scope', '$stateParams', 'ajax', 'dataFactory', function ($scope, $stateParams, ajax, dataFactory) {
		$scope.followFlag = false;
		$scope.userlogin = "DMC Member";
		$scope.NewComment = "";
		$scope.discussion = null;
/*
		$scope.discussion = {
			title: "Aenean euismod bibendum laoreet. Cum soci?",
			comments: [
				{
					full_name: "DMC Member",
					avatar: "/images/carbone.png",
					text: "Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?",
					create_at: "12/01/2015 7:28 PM",
					userRatingReview: {
						"DMC Member": "none"
					},
					like: 22,
					dislike: 11,
				},
				{
					full_name: "DMC Member",
					avatar: "/images/carbone.png",
					text: "Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?",
					create_at: "12/01/2015 7:28 PM",
					userRatingReview: {
						"DMC Member": "like"
					},
					like: 22,
					dislike: 11,
				},
				{
					full_name: "DMC Member",
					avatar: "/images/carbone.png",
					text: "Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?",
					create_at: "12/01/2015 7:28 PM",
					userRatingReview: {
						"DMC Member": "dislike"
					},
					like: 22,
					dislike: 11,
				},
				{
					full_name: "DMC Member",
					avatar: "/images/carbone.png",
					text: "Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?",
					create_at: "12/01/2015 7:28 PM",
					userRatingReview: {
						"DMC Member": "none"
					},
					like: 22,
					dislike: 11,
				},
				{
					full_name: "DMC Member",
					avatar: "/images/carbone.png",
					text: "Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?Aenean euismod bibendum laoreet. Cum soci?",
					create_at: "12/01/2015 7:28 PM",
					userRatingReview: {
						"DMC Member": "none"
					},
					like: 22,
					dislike: 11,
				},
			],
			tags:[
				"Manufacturing",
				"3D Printering",
				"Science",
				"Manufacturing",
				"3D Printering",
				"Science",
				"Manufacturing",
				"3D Printering",
				"Science",
				"Manufacturing",
			]
		}
*/
		$scope.realtedDiscussions = [
			"Aenean euismod bibendum laoreet.",
			"Aenean euismod bibendum laoreet.",
			"Aenean euismod bibendum laoreet.",
			"Aenean euismod bibendum laoreet.",
			"Aenean euismod bibendum laoreet.",
			"Aenean euismod bibendum laoreet.",
			"Aenean euismod bibendum laoreet."
		];

		//load Disscussion
		ajax.on(
			dataFactory.getIndividualDiscussion(),
			{
				id: $stateParams.discussionId,
			},
			function(data){
				console.info(data.result)
				$scope.discussion = data.result;
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
			},
			function(){
				toastModel.showToast("error", "Fail Load IndividualDiscussion");
			}
		);

		//load realted Disscussion
		ajax.on(
			dataFactory.getIndividualDiscussion(),
			{
				all: true,
			},
			function(data){
				console.info(data.result)
				$scope.realtedDiscussions = data.result;
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
			},
			function(){
				toastModel.showToast("error", "Fail Load IndividualDiscussion");
			}
		);


		$scope.follow = function(){
			$scope.followFlag = !$scope.followFlag;
		}

		//Like review
		$scope.Like = function(item){
			if(item.userRatingReview[$scope.userlogin] == "none"){
				item.like++;
				item.userRatingReview[$scope.userlogin] = 'like';
			}else if(item.userRatingReview[$scope.userlogin] == 'like'){
				item.like--;
				item.userRatingReview[$scope.userlogin] = "none";
			}else{
				item.like++;
				item.userRatingReview[$scope.userlogin] = 'like';
				item.dislike--;
			}
			ajax.on(
				dataFactory.addDiscussionLikeDislike(),
				{
					commentId: item.id,
					like: item.like,
					dislike: item.dislike,
					ratingComment: item.userRatingReview[$scope.userlogin],
					userLogin: $scope.userlogin
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
			if(item.userRatingReview[$scope.userlogin] == "none"){
				item.dislike++;
				item.userRatingReview[$scope.userlogin] = 'dislike';
			}else if(item.userRatingReview[$scope.userlogin] == 'dislike'){
				item.dislike--;
				item.userRatingReview[$scope.userlogin] = "none";
			}else{
				item.dislike++;
				item.userRatingReview[$scope.userlogin] = 'dislike';
				item.like--;
			}
			ajax.on(
				dataFactory.addDiscussionLikeDislike(),
				{
					commentId: item.id,
					like: item.like,
					dislike: item.dislike,
					ratingComment: item.userRatingReview[$scope.userlogin],
					userLogin: $scope.userlogin
				},
				function(data){
				},
				function(){
				},
				"POST"
			);
		};

		//Submit Leave A Review form
		$scope.Submit = function(NewComment){
			ajax.on(
				dataFactory.addCommentIndividualDiscussion(),
				{
					discussionId: $stateParams.discussionId,
					name: "DMC Member",
					avatar: "/images/carbone.png",
					comment: NewComment
				},
				function(data){
					$scope.discussion.comments.push(data);
					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
				},
				function(){
					toastModel.showToast("error", "Fail add comment");
				},
				"POST"
			);
			$scope.NewComment = "";
		};

	}]);
