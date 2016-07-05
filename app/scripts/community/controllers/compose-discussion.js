angular.module('dmc.compose-discussion',[])
    .controller("ComposeDiscussionController", [
        '$scope',
        'ajax',
        'dataFactory',
        '$rootScope',
        '$window',
        '$location',
        '$mdDialog',
        "$mdToast",
        "previousPage",
        "project_id",
        "$timeout",
        "toastModel",
        function ($scope,
                  ajax,
                  dataFactory,
                  $rootScope,
                  $window,
                  $location,
                  $mdDialog,
                  $mdToast,
                  previousPage,
                  project_id,
                  $timeout,
                  toastModel) {

            $timeout(function(){
                $("#subject-compose-discussion").focus();
            },800);
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

            $scope.projectId = (project_id ? project_id : null);

            $scope.save = function(message, subject){
                ajax.create(
                    dataFactory.addDiscussion(), {
                        "title": subject,
                        "projectId" : $scope.projectId,
                        "accountId" : $rootScope.userData.accountId,
                        "created_by" : $rootScope.userData.displayName,
                        "created_at": Date.parse(new Date())
                    },
                    function(response){
                        createMessage(response.data.id,message);
                    }
                );
            };

            function redirect(id){
                if($scope.projectId){
                    previousPage.set(location.origin + '/project.php#'+$location.$$path);
                }else{
                    previousPage.set(location.origin + '/community.php');
                }
                toastModel.showToast("success", "Discussion created");
                $mdDialog.hide();
                $window.location.href = '/individual-discussion.php#/' + id;
            }

            function followDiscussion(id){
                ajax.create(dataFactory.followDiscussion(),{
                    "accountId" : $rootScope.userData.accountId,
                    "individual-discussionId": id
                },function(response){
                    if ($scope.NewDiscussion.tags.length > 0) {
                        for (var i in $scope.NewDiscussion.tags) {
                            ajax.create(
                                dataFactory.addDiscussionTag(), {
                                    "name": $scope.NewDiscussion.tags[i],
                                    "individual-discussionId": id
                                }, function (data) {
                                }
                            );
                            if (i == $scope.NewDiscussion.tags.length - 1) redirect(id);
                        }
                    } else {
                        redirect(id);
                    }
                });
            }

            function createMessage(id,message){
                ajax.create(
                    dataFactory.addCommentIndividualDiscussion(), {
                        "individual-discussionId": id,
                        "full_name": $rootScope.userData.displayName,
                        "accountId": $rootScope.userData.accountId,
                        "commentId" : 0,
                        "avatar": "/images/carbone.png",
                        "text": message,
                        "created_at": moment(new Date).format("x"),
                        "like": 0,
                        "dislike": 0,
                        "reply": false
                    },
                    function(response){
                        followDiscussion(id);
                    }
                );
            }

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }
        }
    ]
);