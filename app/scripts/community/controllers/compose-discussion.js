angular.module('dmc.community')
    .controller("ComposeDiscussionController", [
        '$scope',
        'ajax',
        'dataFactory',
        '$rootScope',
        '$window',
        '$location',
        '$mdDialog',
        "$mdToast",
        "toastModel",
        function ($scope,
                  ajax,
                  dataFactory,
                  $rootScope,
                  $window,
                  $location,
                  $mdDialog,
                  $mdToast,
                  toastModel) {

            $scope.NewDiscussion = {
                subject: "",
                tags: [],
                message: ""
            };

            $scope.cancel = function(){
                $scope.NewDiscussion = {
                    subject: "",
                    tags: [],
                    message: ""
                };
                $mdDialog.hide();
            };

            $scope.addTag = function(inputTag){
                if(!inputTag)return;
                $scope.NewDiscussion.tags.push(inputTag);
                this.inputTag = null;
            };

            //remove tag
            $scope.deleteTag = function(index){
                $scope.NewDiscussion.tags.splice(index,1);
            };

            $scope.save = function(message, subject){
                ajax.create(
                    dataFactory.addDiscussion(), {
                        "title": $scope.NewDiscussion.subject,
                        "accountId" : $rootScope.userData.accountId
                    },
                    function(response){
                        if( followDiscussion(response.data.id) && createMessage(response.data.id,$scope.NewDiscussion.message)) {
                            if ($scope.NewDiscussion.tags.length > 0) {
                                for (var i in $scope.NewDiscussion.tags) {
                                    ajax.create(
                                        dataFactory.addDiscussionTag(), {
                                            "name": $scope.NewDiscussion.tags[i],
                                            "individual-discussionId": response.data.id
                                        }, function (data) {
                                        }
                                    );
                                    if (i == $scope.NewDiscussion.tags.length - 1) {
                                        toastModel.showToast("success", "Discussion created");
                                        // $scope.linkToDiscussion = '/individual-discussion.php#/' + response.data.id;
                                        $mdDialog.hide();
                                        $window.location.href = '/individual-discussion.php#/' + response.data.id;
                                    }
                                }
                            } else {
                                //toastModel.showToast("success", "Discussion created");
                                // $scope.linkToDiscussion = '/individual-discussion.php#/' + response.data.id;
                                $mdDialog.hide();
                                $window.location.href = '/individual-discussion.php#/' + response.data.id;
                            }
                        }
                    }
                );
            };

            function followDiscussion(id){
                return ajax.create(dataFactory.followDiscussion(),{
                    "accountId" : $rootScope.userData.accountId,
                    "individual-discussionId": id
                },function(response){
                    return response;
                });
            }

            function createMessage(id,message){
                return ajax.create(
                    dataFactory.addCommentIndividualDiscussion(), {
                        "individual-discussionId": id,
                        "full_name": $rootScope.userData.displayName,
                        "accountId": $rootScope.userData.accountId,
                        "commentId" : 0,
                        "avatar": "/images/carbone.png",
                        "text": message,
                        "created_at": moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
                        "userRatingReview": {
                            "DMC Member": "like"
                        },
                        "like": 0,
                        "dislike": 0
                    },
                    function(data){
                        return data;
                    }
                );
            }

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }
        }
    ]
);