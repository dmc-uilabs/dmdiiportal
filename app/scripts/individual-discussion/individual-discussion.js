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
    'dmc.model.previous-page',
    'ngCookies'
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
        '$cookies',
        'previousPage',
        'toastModel',
        function ($scope,
                  $stateParams,
                  ajax,
                  dataFactory,
                  $mdDialog,
                  $mdToast,
                  $rootScope,
                  DMCUserModel,
                  $cookies,
                  previousPage,
                  toastModel) {

            // comeback to the previous page
            $scope.previousPage = previousPage.get();

            if($scope.previousPage.tag == "project" || $scope.previousPage.tag == "my-projects" || $scope.previousPage.tag == "all-projects"){
                $(".bottom-header .active-page").removeClass("active-page");
                $(".projects-header-button").addClass("active-page");
            }

            $scope.followFlag = null;
            $scope.userData = $rootScope.userData;
            $scope.NewComment = "";
            $scope.discussion = null;
            $scope.flagReviewFlag = false;
            $scope.replyReviewFlag = false;
            $scope.showReplyFlag = false;

            $scope.userData = DMCUserModel.getUserData();
            $scope.userData.then(function(result) {  // this is only run after $http completes
                $scope.userData = result;
                init();
            });

            function init(){
                //load Discussion
                ajax.get(
                    dataFactory.getIndividualDiscussion($stateParams.discussionId), {},
                    function(response){
                        $scope.discussion = response.data;
                        if($scope.discussion) {
                            $scope.loadTags();
                            $scope.loadComments();
                            isFollowed();
                        }
                        apply();
                    }
                );

                // load tags
                $scope.loadTags = function(){
                    ajax.get(dataFactory.getDiscussionTags($stateParams.discussionId), {
                        "_order" : "DESC",
                        "_sort" : "id"
                    }, function(response){
                        $scope.discussion.tags = response.data;
                        apply();
                    });
                };

                //load hrlpful
                $scope.get_helpful = function(comment){
                    ajax.get(dataFactory.getDiscussionCommentsHelpful(),
                        {
                            'commentId': comment.id,
                            'accountId': $rootScope.userData.accountId
                        },
                        function(response){
                            comment['helpful'] = response.data[0];
                        }
                    )
                }

                //load reply
                $scope.get_reply = function(comment){
                    ajax.get(dataFactory.getDiscussionsReply(comment.id),
                        {
                            '_order': "DESC",
                            '_sort': "date"
                        },
                        function(response){
                            for(var i in response.data){
                                response.data[i].created_at = moment(response.data[i].created_at).format("MM/DD/YYYY hh:mm A");
                                $scope.get_helpful(response.data[i]);
                            }                        
                            comment['replyReviews'] = response.data;
                        }
                    )
                }

                $scope.get_flagged = function(comment){
                    ajax.get(dataFactory.getDiscussionCommentsFlagged(),
                        {
                            'commentId': comment.id,
                            'accountId': $rootScope.userData.accountId
                        },
                        function(response){
                            if (response.data.length) {
                                comment['flagged'] = true;
                            }else{
                                comment['flagged'] = false;
                            };
                        }
                    )
                };

                // load comments
                $scope.loadComments = function(){
                    ajax.get(dataFactory.getDiscussionComments($stateParams.discussionId), {
                        "_order" : "DESC",
                        "_sort" : "created_at"
                    }, function(response){
                        $scope.discussion.comments = {};
                        $scope.discussion.comments.items = response.data.reverse();
                        for (var c in $scope.discussion.comments.items) {
                            $scope.discussion.comments.items[c].created_at = moment($scope.discussion.comments.items[c].created_at).format('MM/DD/YYYY hh:mm A');
                            if ($scope.userData.accountId == $scope.discussion.comments.items[c].accountId) $scope.discussion.comments.items[c].isOwner = true;
                            $scope.get_helpful($scope.discussion.comments.items[c]);
                            $scope.get_reply($scope.discussion.comments.items[c]);
                            $scope.get_flagged($scope.discussion.comments.items[c]);
                        }
                        apply();
                    });
                };

                //load realted Disscussion
                $scope.getRealtedDisscussion = function() {
                    ajax.get(
                        dataFactory.getIndividualDiscussions(), {
                            "_limit": 5
                        }, function (response) {
                            $scope.realtedDiscussions = response.data;
                            apply();
                        }
                    );
                };
                $scope.getRealtedDisscussion();


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
                    if(item.helpful){
                        if(item.helpful.helpful === true){
                            item.helpful.helpful = null;
                            item.like--;
                        }else if(item.helpful.helpful === false){
                            item.helpful.helpful = true;
                            item.like++;
                            item.dislike--;
                        }else{
                            item.helpful.helpful = true;
                            item.like++;
                        }
                        ajax.update(dataFactory.updateDiscussionCommentsHelpful(item.helpful.id),
                            item.helpful,
                            function(response){}
                        )
                    }else{
                        item.like++;
                        ajax.create(dataFactory.addDiscussionCommentsHelpful(),
                            {
                                accountId: $rootScope.userData.accountId,
                                commentId: item.id,
                                helpful: true      
                            },function(response){
                                item.helpful = response.data;
                            }
                        )
                    }
                    ajax.get(dataFactory.saveChangedDiscussionComment(item.id),
                        {},
                        function(response){
                            response.data.like = item.like;
                            response.data.dislike = item.dislike;
                            ajax.update(dataFactory.saveChangedDiscussionComment(item.id),
                                response.data,
                                function(response){}
                            )
                        }
                    )
                };

                //DisLike review
                $scope.DisLike = function(item){
                    if(item.helpful){
                        if(item.helpful.helpful === true){
                            item.helpful.helpful = false;
                            item.dislike++;
                            item.like--;
                        }else if(item.helpful.helpful === false){
                            item.helpful.helpful = null;
                            item.dislike--;
                        }else{
                            item.helpful.helpful = false;
                            item.dislike++;
                        }
                        ajax.update(dataFactory.updateDiscussionCommentsHelpful(item.helpful.id),
                            item.helpful,
                            function(response){}
                        )
                    }else{
                        item.dislike++;
                        ajax.create(dataFactory.addDiscussionCommentsHelpful(),
                            {
                                accountId: $rootScope.userData.accountId,
                                commentId: item.id,
                                helpful: false      
                            },function(response){
                                item.helpful = response.data;
                            }
                        )
                    }
                    ajax.get(dataFactory.saveChangedDiscussionComment(item.id),
                        {},
                        function(response){
                            response.data.like = item.like;
                            response.data.dislike = item.dislike;
                            ajax.update(dataFactory.saveChangedDiscussionComment(item.id),
                                response.data,
                                function(response){}
                            )
                        }
                    )
                };

                //Submit comment
                $scope.Submit = function(){
                    ajax.create(
                        dataFactory.addCommentIndividualDiscussion(), {
                            "individual-discussionId": $stateParams.discussionId,
                            "full_name": $scope.userData.displayName,
                            "accountId": $scope.userData.accountId,
                            "avatar": "/images/carbone.png",
                            "reply": false,
                            "commentId": 0,
                            "text": $scope.newComment,
                            "created_at": moment(new Date).format("x"),
                            "like": 0,
                            "dislike": 0
                        },
                        function(response){
                            $scope.newComment = "";
                            response.data.created_at = moment(response.data.created_at).format('MM/DD/YYYY hh:mm A');
                            response.data.isOwner = true;
                            $scope.discussion.comments.items.push(response.data);
                            $('.md-char-counter').text('0/1000');
                            apply();
                        }
                    );
                };

                //Submit reply comment
                $scope.SubmitReply = function(NewComment, id, index){
                    console.info("n", NewComment);
                    ajax.create(dataFactory.addCommentIndividualDiscussion(), {
                            "individual-discussionId": $stateParams.discussionId,
                            "full_name": $scope.userData.displayName,
                            "accountId": $scope.userData.accountId,
                            "avatar": "/images/carbone.png",
                            "reply": false,
                            "commentId": id,
                            "text": NewComment.Comment,
                            "created_at": moment(new Date).format("x"),
                            "like": 0,
                            "dislike": 0
                        },
                        function(response){
                            ajax.get(dataFactory.saveChangedDiscussionComment(id),
                                {},
                                function(response){
                                    response.data.reply = true;
                                    ajax.update(dataFactory.saveChangedDiscussionComment(id),
                                        response.data,
                                        function(response){}
                                    )
                                }
                            )
                            $scope.discussion.comments.items[index].reply = true;
                            $scope.showReplyFlag = index;
                            response.data.created_at = moment(response.data.created_at).format("MM/DD/YYYY hh:mm A");
                            if($scope.discussion.comments.items[index].replyReviews){
                                $scope.discussion.comments.items[index].replyReviews.unshift(response.data);
                            }else{
                                $scope.discussion.comments.items[index]['replyReviews'] = [response.data];
                            }
                        }
                    );
                    $scope.flagReviewFlag = false;
                    $scope.replyReviewFlag = false;
                }

                //Submit flagged comment
                $scope.SubmitFlagged = function(NewComment, id, index){
                    ajax.create(dataFactory.addDiscussionCommentsFlagged(),
                        {
                            'commentId': id,
                            'accountId': $rootScope.userData.accountId
                        },
                        function(response){}
                    );

                    $scope.discussion.comments.items[index]['flagged'] = true;
                    $scope.flagReviewFlag = false;
                    $scope.replyReviewFlag = false;
                };

                $scope.flagged = function(index){
                    $scope.replyReviewFlag = false;
                    $scope.flagReviewFlag = ( $scope.flagReviewFlag === index ? false : index );
                };

                $scope.reply = function(index){
                    $scope.flagReviewFlag = false;
                    $scope.replyReviewFlag = ( $scope.replyReviewFlag === index ? false : index );
                };

                $scope.ShowReply = function(index){
                    $scope.showReplyFlag = ( $scope.showReplyFlag === index ? false : index );
                }

                $scope.Cancel = function(){
                    $scope.flagReviewFlag = false;
                    $scope.replyReviewFlag = false;
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
