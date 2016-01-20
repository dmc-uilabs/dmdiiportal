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
	.controller('individual-discussionController', ['$scope', '$stateParams', 'ajax', 'dataFactory', '$mdDialog', '$mdToast', 'toastModel', function ($scope, $stateParams, ajax, dataFactory, $mdDialog, $mdToast, toastModel) {
		$scope.followFlag = false;
		$scope.userlogin = "DMC Member";
		$scope.NewComment = "";
		$scope.discussion = null;
		$scope.flagReviewFlag = false;

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

		$scope.flagPost = function(index){
			if($scope.flagReviewFlag === index){
				$scope.flagReviewFlag = false;
			}else{
				$scope.flagReviewFlag = index;
			}
			
		}

		$scope.Cancel = function(){
			$scope.flagReviewFlag = false;
		}

		$scope.SubmitReview = function(NewReview){
			$scope.flagReviewFlag = false;
		}

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
				})
				.then(function() {
				}, function() {
				});
		}

	}])
	.controller("ComposeDiscussionController", ['$scope', 'ajax', 'dataFactory', '$mdDialog',  function ($scope, ajax, dataFactory, $mdDialog) {
		$scope.tags=["Metal", "Dashboard", "Dashboard",
		"Metal", "Dashboard", "Dashboard",
		"Metal", "Dashboard", "Dashboard"
		]
		$scope.message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio."


		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.addTag = function(inputTag){
			if(!inputTag)return;
			$scope.tags.push(inputTag);
			this.inputTag = null;
		}

		//remove tag
		$scope.deleteTag = function(index){
			$scope.tags.splice(index,1);
		}

		$scope.save = function(message, subject){
			console.info("save", message, subject)
			$mdDialog.hide();
		}
	}]);;
