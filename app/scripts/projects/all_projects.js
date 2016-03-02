'use strict';

angular.module('dmc.all_projects', [
        'dmc.widgets.services',
        'dmc.widgets.tasks',
        'dmc.widgets.discussions',
        'dmc.widgets.projects',
        'ngtimeago',
        'dmc.configs.ngmaterial',
        'ngMdIcons',
        'ui.router',
        'dmc.model.previous-page',
        'md.data.table',
        'dmc.common.header',
        'dmc.common.footer'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('all-projects', {
        url: '/',
        templateUrl: 'templates/projects/all.html',
        controller: 'DMCAllProjectsController'
    });
    $urlRouterProvider.otherwise('/');
})
.controller('DMCAllProjectsController', function ($scope,$rootScope,$element) {
    $scope.sortList = [
        {
            id : 3, tag : "most_recent", name : "Most recent"
        },{
            id : 2, tag : "title", name : "Name"
        },{
            id : 1, tag : "id", name : "ID Project"
        }
    ];
    $scope.filterList = [
        {
            id : 1, tag : "id1", name : "ID Project1"
        },{
            id : 2, tag : "id2", name : "ID Project2"
        },{
            id : 3, tag : "id3", name : "ID Project3"
        },{
            id : 4, tag : "id4", name : "ID Project4"
        },{
            id : 5, tag : "id5", name : "ID Project5"
        }
    ];

    $scope.sortModel = 0;
        $scope.selectItemDropDown = function(type){
            if(type == "filter"){
                var item = $scope.filterList[$scope.filterModel];
                if($scope.filterModel != 0) {
                    $scope.filterList.splice($scope.filterModel, 1);
                    $scope.filterList = $scope.filterList.sort(function(a,b){return a.id - b.id});
                    if ($scope.filterList.unshift(item)) $scope.filterModel = 0;
                }
                $rootScope.sortMAProjects(item.tag);
            }else{
                var item = $scope.sortList[$scope.sortModel];
                if($scope.sortModel != 0) {
                    $scope.sortList.splice($scope.sortModel, 1);
                    $scope.sortList = $scope.sortList.sort(function(a,b){return a.id - b.id});
                    if ($scope.sortList.unshift(item)) $scope.sortModel = 0;
                }
                $rootScope.sortMAProjects(item.tag);
            }
        };

        $scope.updateSort = function(){
            var item = $scope.sortList[$scope.sortModel];
            $rootScope.sortMAProjects(item.tag);
        }


});
