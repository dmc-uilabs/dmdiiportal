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
                widgetShowAllBlocks: "=",
                showImage : "=",
                widgetFormat: "=",
                sortProjects: "=",
                limit : "="
            },
            controller: function($scope, $rootScope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel) {
                $scope.projects = [];
                $scope.total = 0;
                $scope.order = 'ASC';
                var limit = ($scope.limit ? $scope.limit : ($scope.widgetShowAllBlocks == true ? 10 : 2));

                $scope.flexBox = ($scope.widgetShowAllBlocks == true ? 28 : 60);
                $scope.flexDetails = ($scope.widgetShowAllBlocks == true ? 20 : 40);

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                // function for get all projects from DB
                $scope.getProjects = function(){
                    ajax.get(dataFactory.getProjects(),{
                        _sort : $scope.sortProjects,
                        _order : $scope.order,
                        _start : 0
                    },function(response){
                        $scope.total = response.data.length;
                        $scope.projects = response.data;
                        if($scope.total > limit) $scope.projects.splice(limit,$scope.total);
                        for(var i in $scope.projects) {
                            if ($scope.projects[i].dueDate) {
                                var day = 86400000;
                                $scope.projects[i].dueDate = (new Date() - new Date($scope.projects[i].dueDate));
                                if ($scope.projects[i].dueDate <= day) {
                                    $scope.projects[i].dueDate = moment(new Date()).format("MM/DD/YYYY");
                                } else {
                                    $scope.projects[i].dueDate = Math.floor($scope.projects[i].dueDate / day) + " days";
                                }
                            }
                        }
                        apply();
                    },function(response){
                        toastModel.showToast("error", "Ajax faild: getProjects");
                    });
                };

                $scope.getProjects();

                $rootScope.sortMAProjects = function(sortTag){
                    switch(sortTag) {
                        case "id":
                            $scope.projects.sort(function (a, b) {
                                return a.id - b.id;
                            });
                            break;
                        case "title":
                            $scope.projects.sort(function (a, b) {
                                return a.title > b.title;
                            });
                            break;
                        case "most_recent":
                            $scope.projects.sort(function (a, b) {
                                return b.id - a.id;
                            });
                            break;
                        default:
                            break;
                    }
                };

                //socketFactory.on(socketFactory.updated().projects, function(item){
                //    $scope.getProjects();
                //});
            }
        };
    }]);