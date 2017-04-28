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
            url: '/?text',
            templateUrl: 'templates/projects/all.html',
            controller: 'DMCAllProjectsController'
        });
        $urlRouterProvider.otherwise('/');
    })
    .controller('DMCAllProjectsController', function ($scope,$rootScope,$element,$stateParams,$state, dataFactory, ajax, toastModel, DMCUserModel) {

        $scope.myChildFunc = null;
        $scope.myProjectsFlag = true;
        $scope.allProjectsFlag = false;
        $scope.searchText = angular.isDefined($stateParams.text) ? $stateParams.text : null;
        $scope.filterModel = null;
        $scope.sortModel = 0;
        $scope.sortProjects = "most_recent";
        $scope.isActive = false;

        $scope.submit = function(text){
            var dataSearch = $.extend(true, {}, $stateParams);
            dataSearch.text = text;
            $state.go('all-projects', dataSearch, {reload: true});
        };


        $scope.sortList = [
            {
                id : 3, tag : "most_recent", name : "Most recent"
            },{
                id : 2, tag : "title", name : "Name"
            }
        ];
        
        $scope.filters = {
            private: false,
            public: false,
            pendingInvites: false
        };

        $scope.selectItemDropDown = function(type){
            if(type == "filter"){
                var item = $scope.filterList[$scope.filterModel];
                if($scope.filterModel != 0) {
                    $scope.filterList.splice($scope.filterModel, 1);
                    $scope.filterList = $scope.filterList.sort(function(a,b){return a.id - b.id});
                    if ($scope.filterList.unshift(item)) $scope.filterModel = 0;
                }
                $rootScope.filterMAProjects(item.tag);
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
            console.log(item.tag);
            $rootScope.sortMAProjects(item.tag);
        };

        $scope.updateFilter = function(){
            var item = $scope.filterList[$scope.filterModel];
            $rootScope.filterMAProjects(item.tag);
        };
    
        $scope.oneAtATime = true;
    
        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };
        
        $scope.toggleProjectsFlag = function(flag) {
            if (flag === "myProjectsFlag" ) {
                $scope.myProjectsFlag = !$scope.myProjectsFlag;
            } else if (flag === "allProjectsFlag") {
                $scope.allProjectsFlag = !$scope.allProjectsFlag;
            }
        };
        
        $scope.setFilter = function(filter) {
            console.log(filter);
            if (filter === 'public') {
                $scope.filters.public = !$scope.filters.public;
                $scope.filters.private = false;
                $scope.filters.pendingInvites = false;
                console.log($scope.filters);
            } else if (filter === 'private') {
                $scope.filters.public = false;
                $scope.filters.private = !$scope.filters.private;
                $scope.filters.pendingInvites = false;
            } else if (filter === 'pendingInvites') {
                $scope.filters.public = false;
                $scope.filters.private = false;
                $scope.filters.pendingInvites = !$scope.filters.pendingInvites;
            } else {
                $scope.filters.public = false;
                $scope.filters.private = false;
                $scope.filters.pendingInvites = false;
            }
            
        };
    
        $scope.rotate = function () {
            $scope.isActive = !$scope.isActive;
        };

    });
