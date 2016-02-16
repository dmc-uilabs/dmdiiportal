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
                    ajax.get(dataFactory.getDiscussions($scope.projectId,$scope.widgetDataType),{
                            _start : 0,
                            _order : "DESC",
                            _sort : "id"
                        }, function(response){
                            $scope.total = response.data.length;
                            $scope.discussions = response.data;
                            if($scope.total > limit) $scope.discussions.splice(limit,$scope.total);
                            for(var index in $scope.discussions){
                                $scope.discussions[index].created_at = moment($scope.discussions[index].created_at,'DD-MM-YYYY HH:mm:ss').format("MM/DD/YY hh:mm A");
                            }
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        },function(){
                            toastModel.showToast("error", "Ajax faild: getDiscussions");
                        }
                    );
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
                        clickOutsideToClose: false,
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
                    ajax.get(dataFactory.getDiscussions($scope.projectId,$scope.widgetDataType),{
                            _start : 0,
                            _order : $scope.order,
                            _sort : $scope.sort
                        }, function(response){
                            $scope.totalItems = response.data.length;
                            $scope.projectDiscussions = response.data;
                            if($scope.totalItems > limit) $scope.projectDiscussions.splice(limit,$scope.totalItems);
                            for(var index in $scope.projectDiscussions){
                                $scope.projectDiscussions[index].created_at = moment($scope.projectDiscussions[index].created_at,'DD-MM-YYYY HH:mm:ss').format("MM/DD/YY hh:mm A");
                            }
                            apply();
                        },function(){
                            toastModel.showToast("error", "Ajax faild: getProjectDiscussions");
                        }
                    );
                };

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
            ajax.create(dataFactory.createDiscussion(),{
                    "projectId": projectId,
                    "subject": $scope.subject,
                    "created_at": moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
                    "text": $scope.content,
                    "full_name": $rootScope.userData.displayName,
                    "avatar": "/images/avatar-fpo.jpg",
                    "replies": 13,
                    "latest-post": {
                        "created-by": $rootScope.userData.displayName,
                        "created-at": "12/05/15 11:00 PM"
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
        };
    })