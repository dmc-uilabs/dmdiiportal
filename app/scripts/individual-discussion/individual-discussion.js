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
	.controller('individual-discussionController', ['$scope', '$stateParams', 'ajax', 'dataFactory', '$mdDialog', '$mdToast', 'toastModel', function ($scope, $stateParams, ajax, dataFactory, $mdDialog, $mdToast, toastModel) {
		$scope.followFlag = false;
		$scope.userlogin = "DMC Member";
		$scope.NewComment = "";
		$scope.discussion = null;

        $scope.accountId = 1;
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

		//load Discussion
        ajax.on(
            dataFactory.getIndividualDiscussion($stateParams.discussionId), {},
            function(data){
                $scope.discussion = data;
                if($scope.discussion) {
                    $scope.loadTags();
                    $scope.loadComments();
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            },
            function(){
                toastModel.showToast("error", "Fail Load IndividualDiscussion");
            }
        );

        // load tags
        $scope.loadTags = function(){
            ajax.on(dataFactory.getDiscussionTags(), {
                "_order" : "DESC",
                "_sort" : "id",
                "individualDiscussionId" : $stateParams.discussionId
            }, function(data){
                $scope.discussion.tags = data;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }, function(){
                toastModel.showToast("error", "Unable get tags");
            },"GET");
        };

        // load comments
        $scope.loadComments = function(){
            ajax.on(dataFactory.getDiscussionComments($scope.discussion.comments.link), {
                "_order" : "DESC",
                "_sort" : "created_at"
            }, function(data){
                $scope.discussion.comments.items = data.reverse();
                for (var c in $scope.discussion.comments.items) {
                    $scope.discussion.comments.items[c].created_at = moment($scope.discussion.comments.items[c].created_at).format('MM/DD/YYYY, h:mm A');
                    if ($scope.accountId == $scope.discussion.comments.items[c].accountId) $scope.discussion.comments.items[c].isOwner = true;
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }, function(){
                toastModel.showToast("error", "Unable get comments");
            },"GET");
        };

        //load realted Disscussion
        ajax.on(
            dataFactory.getIndividualDiscussions(),{
                "_limit" : 5
            },
            function(data){
                $scope.realtedDiscussions = data;
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
        $scope.Submit = function(){
            ajax.on(dataFactory.getLastDiscussionCommentId(), {
                "_limit" : 1,
                "_order" : "DESC",
                "_sort" : "id"
            }, function(data){
                var lastId = (data.length == 0 ? 1 : parseInt(data[0].id)+1);
                ajax.on(
                    dataFactory.addCommentIndividualDiscussion(),
                    {
                        "id": lastId,
                        "individual-discussionId": $stateParams.discussionId,
                        "full_name": "DMC Member",
                        "accountId": $scope.accountId,
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
                        $scope.newComment = null;
                        data.created_at = moment(data.created_at).format('MM/DD/YYYY, h:mm A');
                        data.isOwner = true;
                        $scope.discussion.comments.items.push(data);
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },
                    function(){
                        toastModel.showToast("error", "Fail add comment");
                    }, "POST"
                );
            }, function(){
                toastModel.showToast("error", "Unable get last id");
            },"GET");
        };

		$scope.flagPost = function(index){
			if($scope.flagReviewFlag === index){
				$scope.flagReviewFlag = false;
			}else{
				$scope.flagReviewFlag = index;
			}
			
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
				})
				.then(function() {
				}, function() {
				});
		}

	}])
	.controller("ComposeDiscussionController", ['$scope', 'ajax', 'dataFactory', '$mdDialog', "$mdToast", "toastModel",  function ($scope, ajax, dataFactory, $mdDialog, $mdToast, toastModel) {
		
		$scope.newDiscussion = {
			subject: "",
			tags: [
				"Metal", 
				"Dashboard",
				"Dashboard",
				"Metal", 
				"Dashboard", 
				"Dashboard",
				"Metal", 
				"Dashboard", 
				"Dashboard"
			],
			message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio."
		}


		$scope.cancel = function(){
			$scope.NewDiscussion.tags = [];
			$scope.message = [];
		}

		$scope.addTag = function(inputTag){
			if(!inputTag)return;
			$scope.NewDiscussion.tags.push(inputTag);
			this.inputTag = null;
		}

		//remove tag
		$scope.deleteTag = function(index){
			$scope.NewDiscussion.tags.splice(index,1);
		}

		$scope.save = function(message, subject){    
        ajax.on(dataFactory.getLastDiscussionId(), {
            "_limit" : 1,
            "_order" : "DESC",
            "_sort" : "id"
        }, function(data){
            var lastId = (data.length == 0 ? 1 : parseInt(data[0].id)+1);
            
            ajax.on(
                dataFactory.addDiscussion(),
                {
                    "id": lastId,
                    "title": $scope.NewDiscussion.subject,
                    "comments": { 
							        "link": "/individual-discussion/" + lastId + "/individual-discussion-comment",
							        "totalItems": 0
							      }
                },
                function(data){
                    toastModel.showToast("success", "Discussion created");
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                },
                function(){
                    toastModel.showToast("error", "Fail add discussion");
                }, "POST"
            );
        }, function(){
            toastModel.showToast("error", "Unable get last id");
        },"GET");

			$mdDialog.hide();
		}
	}]);;
