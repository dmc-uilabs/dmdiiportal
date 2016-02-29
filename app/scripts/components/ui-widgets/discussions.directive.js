'use strict';

angular.module('dmc.widgets.discussions',[
        'dmc.ajax',
        'dmc.data',
        'dmc.model.discussion',
        'ngSanitize',
        'ngCookies',
        'dmc.socket',
        'dmc.model.previous-page'
    ]).
    directive('uiWidgetDiscussions', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/discussions.html',
            scope: {
                widgetTitle: "=",
                projectId: "=",
                widgetDataType: "=",
                limit : "="
            },
            controller: function($scope, $element, $attrs, $mdDialog, socketFactory, dataFactory, ajax, toastModel,previousPage) {
                $scope.previousPage = previousPage;
                $scope.discussions = [];
                $scope.total = 0;
                var limit = $scope.limit ? $scope.limit : 4;
                // function for get all discussions from DB
                $scope.getDiscussions = function(){
                    ajax.get(dataFactory.getDiscussions($scope.projectId,$scope.widgetDataType), {
                        "_order" : "DESC",
                        "_sort" : "id"
                    }, function (response) {
                        $scope.totalDiscussions = response.data.length;
                        $scope.discussions = response.data;
                        var ids = $.map($scope.discussions,function(x){ return x.id; });
                        ajax.get(dataFactory.addCommentIndividualDiscussion(),{
                            "individual-discussionId" : ids,
                            "_order" : "DESC",
                            "_sort" : "id"
                        },function(res){
                            for(var i in $scope.discussions){
                                $scope.discussions[i].created_at_format = moment(new Date($scope.discussions[i].created_at)).format("MM/DD/YYYY hh:mm A");
                                $scope.discussions[i].replies = 0;
                                for(var j in res.data){
                                    if($scope.discussions[i].id == res.data[j]["individual-discussionId"]){
                                        $scope.discussions[i].replies++;
                                        $scope.discussions[i].last = res.data[j];
                                        $scope.discussions[i].last.created_at_format = moment(new Date($scope.discussions[i].last.created_at)).format("MM/DD/YYYY hh:mm A");
                                        if($scope.discussions[i].last.isPosted == null){
                                            $scope.discussions[i].last.isPosted = true;
                                        }else if($scope.discussions[i].last.isPosted == true){
                                            $scope.discussions[i].last.isPosted = false;
                                        }
                                    }
                                }
                            }
                            //$scope.discussions.sort(function(a,b){ return b.last.created_at - a.last.created_at; });
                            //$scope.discussions.splice($scope.limit,$scope.discussions.length);
                        });
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });

/*
                    ajax.get(dataFactory.getDiscussions($scope.projectId,$scope.widgetDataType),{
                            _start : 0,
                            _order : "DESC",
                            _sort : "id"
                        }, function(response){
                            $scope.total = response.data.length;
                            $scope.discussions = response.data;
                            if($scope.total > limit) $scope.discussions.splice(limit,$scope.total);
                            //for(var index in $scope.discussions){
                            //    $scope.discussions[index].created_at = moment($scope.discussions[index].created_at,'DD-MM-YYYY HH:mm:ss').format("MM/DD/YY hh:mm A");
                            //}
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        },function(){
                            toastModel.showToast("error", "Ajax faild: getDiscussions");
                        }
                    );*/
                };

                // get all discussions (first request)
                $scope.getDiscussions();

                // Socket listeners -------------------------------------------------

                // get updated discussions
                //socketFactory.on(socketFactory.updated().discussions, function(item){
                //    $scope.getDiscussions();
                //});

                $scope.newDiscussion = function(ev){
                    $mdDialog.show({
                        controller: "CreateDiscussionController",
                        templateUrl: 'templates/components/dialogs/create-discussion-tpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals : {
                            projectId : $scope.projectId
                        }
                    }).then(function (answer) {

                    }, function (update) {
                        if(update) $scope.getDiscussions();
                    });
                };

            }
        };
    }]).
    directive('uiProjectDiscussions', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/project-discussions.html',
            scope:{
                projectId: "=",
                widgetTitle: "=",
                withAvatar: "=",
                totalItems: "=",
                widgetFormat: "=",
                widgetDataType: "=",
                limit : "="
            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel,previousPage) {
                $scope.previousPage = previousPage;
                $scope.projectDiscussions = [];
                $scope.sort = 'created_at';
                $scope.order = 'DESC';
                var limit = $scope.limit ? $scope.limit : 4;

                $scope.totalItems = 0;

                $scope.getProjectDiscussions = function(){
                    ajax.get(dataFactory.getDiscussions($scope.projectId,$scope.widgetDataType), {
                        "_order" : "DESC",
                        "_sort" : "id"
                    }, function (response) {
                        $scope.totalItems = response.data.length;
                        $scope.projectDiscussions = response.data;
                        var ids = $.map($scope.projectDiscussions,function(x){ return x.id; });
                        ajax.get(dataFactory.addCommentIndividualDiscussion(),{
                            "individual-discussionId" : ids,
                            "_order" : "DESC",
                            "_sort" : "id"
                        },function(res){
                            for(var i in $scope.projectDiscussions){
                                $scope.projectDiscussions[i].created_at_format = moment(new Date($scope.projectDiscussions[i].created_at)).format("MM/DD/YYYY hh:mm A");
                                $scope.projectDiscussions[i].replies = 0;
                                for(var j in res.data){
                                    if($scope.projectDiscussions[i].id == res.data[j]["individual-discussionId"]){
                                        $scope.projectDiscussions[i].replies++;
                                        $scope.projectDiscussions[i].last = res.data[j];
                                        $scope.projectDiscussions[i].last.created_at_format = moment(new Date($scope.projectDiscussions[i].last.created_at)).format("MM/DD/YYYY hh:mm A");
                                        if($scope.projectDiscussions[i].last.isPosted == null){
                                            $scope.projectDiscussions[i].last.isPosted = true;
                                        }else if($scope.projectDiscussions[i].last.isPosted == true){
                                            $scope.projectDiscussions[i].last.isPosted = false;
                                        }
                                    }
                                }
                            }
                            //$scope.discussions.sort(function(a,b){ return b.last.created_at - a.last.created_at; });
                            //$scope.discussions.splice($scope.limit,$scope.discussions.length);
                        });
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });
                };

/*
                $scope.getProjectDiscussions = function(){
                    ajax.get(dataFactory.getDiscussions($scope.projectId,$scope.widgetDataType),{
                            _start : 0,
                            _order : $scope.order,
                            _sort : $scope.sort
                        }, function(response){
                            $scope.totalItems = response.data.length;
                            $scope.projectDiscussions = response.data;
                            if($scope.totalItems > limit) $scope.projectDiscussions.splice(limit,$scope.totalItems);
                            //for(var index in $scope.projectDiscussions){
                            //    $scope.projectDiscussions[index].created_at = moment($scope.projectDiscussions[index].created_at,'DD-MM-YYYY HH:mm:ss').format("MM/DD/YY hh:mm A");
                            //}
                            apply();
                        },function(){
                            toastModel.showToast("error", "Ajax faild: getProjectDiscussions");
                        }
                    );
                };
*/
                $scope.getProjectDiscussions();

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
                //socketFactory.on(socketFactory.updated().discussions, function(item){
                //    $scope.getProjectDiscussions();
                //});
            }
        };
    }]).controller('CreateDiscussionController',function($scope,$mdDialog,projectId,ajax,dataFactory,toastModel,$rootScope){
        $scope.isCreation = false;
        $scope.message = {
            error : false
        };
        $scope.cancel = function() {
            $mdDialog.cancel(false);
        };

        $scope.createDiscussion = function(){
            $scope.isCreation = true;
            $scope.message.error = false;
            ajax.create(
                dataFactory.addDiscussion(), {
                    "message": $scope.subject,
                    "title": $scope.content,
                    "accountId" : $rootScope.userData.accountId,
                    "projectId" : projectId,
                    "created_by" : $rootScope.userData.displayName,
                    "created_at": moment().format('x')
                },function(response){
                    $scope.isCreation = false;
                    $mdDialog.cancel(true);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                },function(response){
                    $scope.message.error = true;
                    toastModel.showToast("error", "Ajax faild: createDiscussion");
                    $scope.isCreation = false;
                }
            );

/*
            ajax.create(dataFactory.createDiscussion(),{
                    "projectId": projectId,
                    "subject": $scope.subject,
                    "created_at": moment(new Date()).format('MM/DD/YYYY hh:mm A'),
                    "text": $scope.content,
                    "full_name": $rootScope.userData.displayName,
                    "avatar": "/images/avatar-fpo.jpg",
                    "replies": 13,
                    "latest-post": {
                        "created-by": $rootScope.userData.displayName,
                        "created-at": moment(new Date()).format("MM/DD/YYYY hh:mm A")
                    }
                }, function(response){
                    $scope.isCreation = false;
                    $mdDialog.cancel(true);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                },function(response){
                    $scope.message.error = true;
                    toastModel.showToast("error", "Ajax faild: createDiscussion");
                    $scope.isCreation = false;
                }
            );
*/
        };
    })