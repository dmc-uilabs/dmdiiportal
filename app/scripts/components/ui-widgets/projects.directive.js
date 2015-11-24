'use strict';

angular.module('dmc.widgets.projects',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket'
    ]).
    directive('uiWidgetProjects', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: '/templates/components/ui-widgets/projects.html',
            scope:{
                widgetTitle: "=",
                widgetShowAllBlocks: "="
            },
            link: function (scope, iElement, iAttrs) {

            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax) {
                $scope.projects = [];
                $scope.total = 0;
                $scope.sort = 'id';
                $scope.order = 'DESC';

                $scope.flexLeft = ($scope.widgetShowAllBlocks == true ? 15 : 30);
                $scope.flexRight = ($scope.widgetShowAllBlocks == true ? 85 : 70);
                $scope.flexImage = ($scope.widgetShowAllBlocks == true ? 100 : 30);

                $scope.showItems = function(item,name){
                    item.isShowTasks = ($scope.widgetShowAllBlocks == true || name == 'tasks' ? true : false);
                    item.isShowServices = ($scope.widgetShowAllBlocks == true || name == 'services' ? true : false);
                    item.isShowDiscussions = ($scope.widgetShowAllBlocks == true || name == 'discussions' ? true : false);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                // function for get all projects from DB
                $scope.getProjects = function(){
                    ajax.on(dataFactory.getUrlAllProjects(),{
                        sort : $scope.sort,
                        order : $scope.order,
                        offset : 0,
                        limit : 2
                    },function(data){
                        var projects_ = $scope.projects;
                        $scope.total = data.count;
                        $scope.projects = data.result;
                        for(var i in $scope.projects){
                            var found = false;
                            for(var j in projects_){
                                if($scope.projects[i].id === projects_[j].id){
                                    $scope.projects[i].isShowTasks = projects_[j].isShowTasks;
                                    $scope.projects[i].isShowServices = projects_[j].isShowServices;
                                    $scope.projects[i].isShowDiscussions = projects_[j].isShowDiscussions;
                                    found = true;
                                    break;
                                }
                            }
                            if(!found){
                                $scope.projects[i].isShowTasks = true;
                                $scope.projects[i].isShowServices = ($scope.widgetShowAllBlocks == true ? true : false);
                                $scope.projects[i].isShowDiscussions = ($scope.widgetShowAllBlocks == true ? true : false);
                            }
                        }
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },function(){
                        alert("Ajax faild: getProjects");
                    });
                };

                $scope.getProjects();

                //socketFactory.on(socketFactory.updated().projects, function(item){
                //    $scope.getProjects();
                //});
            }
        };
    }]);