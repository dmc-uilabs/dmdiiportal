'use strict';

angular.module('dmc.widgets.discussions',[
        'dmc.ajax',
        'dmc.data',
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
                widgetTitle: '=',
                projectId: '=',
                widgetDataType: '=',
                limit : '='
            },
            controller: function($scope, $element, $attrs, $mdDialog, socketFactory, dataFactory, ajax, toastModel,previousPage) {
                $scope.previousPage = previousPage;
                $scope.discussions = [];
                $scope.total = 0;
                var limit = $scope.limit ? $scope.limit : 4;
                // function for get all discussions from DB
                $scope.getDiscussions = function(){
                    ajax.get(dataFactory.getDiscussions($scope.projectId, $scope.widgetDataType), {
                        '_order' : 'DESC',
                        '_sort' : 'id'
                    }, function (response) {
                        $scope.total = response.data.length;
                        $scope.discussions = response.data;
                        var ids = $.map($scope.discussions,function(x){ return x.id; });
                        ajax.get(dataFactory.addCommentIndividualDiscussion(),{
                            'individual-discussionId' : ids,
                            '_order' : 'DESC',
                            '_sort' : 'id',
                            'commentId': 0
                        },function(res){
                            for(var i in $scope.discussions){
                                $scope.discussions[i].created_at_format = moment(new Date($scope.discussions[i].created_at)).format('MM/DD/YYYY hh:mm A');
                                $scope.discussions[i].replies = 0;
                                for(var j in res.data){
                                    if($scope.discussions[i].id == res.data[j]['individual-discussionId']){
                                        $scope.discussions[i].replies++;
                                        $scope.discussions[i].last = res.data[j];
                                        $scope.discussions[i].last.created_at_format = moment(new Date($scope.discussions[i].last.created_at)).format('MM/DD/YYYY hh:mm A');
                                        if($scope.discussions[i].isPosted == null){
                                            $scope.discussions[i].isPosted = true;
                                        }else if($scope.discussions[i].isPosted == true){
                                            $scope.discussions[i].isPosted = false;
                                        }
                                    }
                                }
                                if($scope.discussions[i].replies > 0) $scope.discussions[i].replies--;
                                if($scope.discussions[i].isPosted == null) $scope.discussions[i].isPosted = true;
                            }
                            //$scope.discussions.sort(function(a,b){ return b.last.created_at - a.last.created_at; });
                            if(limit < $scope.discussions.length) $scope.discussions.splice(limit,$scope.discussions.length);
                        });
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });
                };

                // get all discussions (first request)
                $scope.getDiscussions();

                // Socket listeners -------------------------------------------------

                // get updated discussions
                //socketFactory.on(socketFactory.updated().discussions, function(item){
                //    $scope.getDiscussions();
                //});

                $scope.newDiscussion = function(ev){
                    $(window).scrollTop(0);
                    $mdDialog.show({
                        controller: 'ComposeDiscussionController',
                        templateUrl: 'templates/individual-discussion/compose-discussion.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: {
                            project_id: $scope.projectId
                        },
                        clickOutsideToClose:true
                    }).then(function() {}, function() {
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
                projectId: '=',
                widgetTitle: '=',
                withAvatar: '=',
                totalItems: '=',
                widgetFormat: '=',
                widgetDataType: '=',
                limit : '='
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
                        '_order' : 'DESC',
                        '_sort' : 'id'
                    }, function (response) {
                        $scope.totalItems = response.data.length;
                        $scope.projectDiscussions = response.data;
                        var ids = $.map($scope.projectDiscussions,function(x){ return x.id; });
                        ajax.get(dataFactory.addCommentIndividualDiscussion(),{
                            'individual-discussionId' : ids,
                            '_order' : 'DESC',
                            '_sort' : 'id',
                            'commentId': 0
                        },function(res){
                            for(var i in $scope.projectDiscussions){
                                $scope.projectDiscussions[i].created_at_format = moment(new Date($scope.projectDiscussions[i].created_at)).format('MM/DD/YYYY hh:mm A');
                                $scope.projectDiscussions[i].replies = 0;
                                for(var j in res.data){
                                    if($scope.projectDiscussions[i].id == res.data[j]['individual-discussionId']){
                                        $scope.projectDiscussions[i].replies++;
                                        $scope.projectDiscussions[i].last = res.data[j];
                                        $scope.projectDiscussions[i].last.created_at_format = moment(new Date($scope.projectDiscussions[i].last.created_at)).format('MM/DD/YYYY hh:mm A');
                                        if($scope.projectDiscussions[i].isPosted == null){
                                            $scope.projectDiscussions[i].isPosted = true;
                                        }else if($scope.projectDiscussions[i].isPosted == true){
                                            $scope.projectDiscussions[i].isPosted = false;
                                        }
                                    }
                                }
                                if($scope.projectDiscussions[i].replies > 0) $scope.projectDiscussions[i].replies--;
                                if($scope.projectDiscussions[i].isPosted == null) $scope.projectDiscussions[i].isPosted = true;
                            }
                            //$scope.discussions.sort(function(a,b){ return b.last.created_at - a.last.created_at; });
                            if(limit < $scope.projectDiscussions.length) $scope.projectDiscussions.splice(limit,$scope.projectDiscussions.length);
                        });
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    });
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
    }])
