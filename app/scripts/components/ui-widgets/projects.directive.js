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
                limit : "="
            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel) {
                $scope.projects = [];
                $scope.total = 0;
                $scope.sort = 'id';
                $scope.order = 'DESC';
                var limit = ($scope.limit ? $scope.limit : ($scope.widgetShowAllBlocks == true ? 10 : 2));

                $scope.flexBox = ($scope.widgetShowAllBlocks == true ? 28 : 60);
                $scope.flexDetails = ($scope.widgetShowAllBlocks == true ? 20 : 40);

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                // function for get all projects from DB
                $scope.getProjects = function(){
                    ajax.get(dataFactory.getProjects(),{
                        _sort : $scope.sort,
                        _order : $scope.order,
                        _start : 0
                    },function(response){
                        $scope.total = response.data.length;
                        $scope.projects = response.data;
                        if($scope.total > limit) $scope.projects.splice(limit,$scope.total);
                        apply();
                    },function(response){
                        toastModel.showToast("error", "Ajax faild: getProjects");
                    });
                };

                $scope.getProjects();

                //socketFactory.on(socketFactory.updated().projects, function(item){
                //    $scope.getProjects();
                //});
            }
        };
    }]);