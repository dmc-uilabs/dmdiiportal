'use strict';

angular.module('dmc.widgets.discussions',[
        'dmc.ajax',
        'dmc.data',
        'dmc.model.discussion',
        'ngSanitize',
        'dmc.socket'
    ]).
    directive('uiWidgetDiscussions', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/discussions.html',
            scope: {
                widgetTitle: "=",
                projectId: "=",
                widgetDataType: "="
            },
            link: function (scope, iElement, iAttrs) {

            },
            controller: function($scope, $element, $attrs, $mdDialog, socketFactory, dataFactory, ajax, toastModel) {
                $scope.discussions = [];
                $scope.total = 0;
                // function for get all discussions from DB
                $scope.getDiscussions = function(){
                    ajax.get(dataFactory.getDiscussions($scope.projectId,$scope.widgetDataType),{
                            _limit : 4,
                            _start : 0,
                            _order : "DESC",
                            _sort : "created_at"
                        }, function(response){
                            $scope.discussions = response.data;
                            $scope.total = $scope.discussions.length;
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
                widgetDataType: "="
            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel) {
                $scope.projectDiscussions = [];
                $scope.sort = 'created_at';
                $scope.order = 'DESC';

                $scope.totalItems = 0;

                $scope.getProjectDiscussions = function(){
                    ajax.get(dataFactory.getDiscussions($scope.projectId,$scope.widgetDataType),{
                            _limit : 4,
                            _start : 0,
                            _order : $scope.order,
                            _sort : $scope.sort
                        }, function(response){
                            $scope.projectDiscussions = response.data;
                            $scope.totalItems = $scope.projectDiscussions.length;
                            for(var index in $scope.projectDiscussions){
                                $scope.projectDiscussions[index].created_at = moment($scope.projectDiscussions[index].created_at,'DD-MM-YYYY HH:mm:ss').format("MM/DD/YY hh:mm A");
                            }
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        },function(){
                            toastModel.showToast("error", "Ajax faild: getProjectDiscussions");
                        }
                    );
                };

                $scope.getProjectDiscussions();

                //socketFactory.on(socketFactory.updated().discussions, function(item){
                //    $scope.getProjectDiscussions();
                //});
            }
        };
    }]).controller('CreateDiscussionController',function($scope,$mdDialog,projectId,ajax,dataFactory,toastModel){
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
                    "full_name": "Jack Graber",
                    "avatar": "/images/avatar-fpo.jpg"
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
    });