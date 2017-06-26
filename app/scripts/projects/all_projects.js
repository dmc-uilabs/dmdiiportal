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

        $scope.myProjectsFlag = true;
        $scope.allProjectsFlag = false;
        $scope.searchText = angular.isDefined($stateParams.text) ? $stateParams.text : null;
        $scope.filterModel = null;
        $scope.sortModel = 0;
        $scope.sortProjects = "most_recent";
        $scope.isActive = false;
        $scope.activeTab = 'my-projects';
        $scope.searchTerm = null;

        $scope.submit = function(text){
            var dataSearch = $.extend(true, {}, $stateParams);
            dataSearch.text = text;
            $state.go('all-projects', dataSearch, {reload: true});
        };
        
        $scope.search = function() {
            $scope.$broadcast('searchProjects');
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
            public: false
        };

        $scope.activeFilter = null;

        $scope.selectItemDropDown = function(type){
            if(type == "filter"){
                var item = $scope.filterList[$scope.filterModel];
                if($scope.filterModel != 0) {
                    $scope.filterList.splice($scope.filterModel, 1);
                    $scope.filterList = $scope.filterList.sort(function(a,b){return a.id - b.id});
                    if ($scope.filterList.unshift(item)) $scope.filterModel = 0;
                }
            }else{
                var item = $scope.sortList[$scope.sortModel];
                // if($scope.sortModel != 0) {
                //     $scope.sortList.splice($scope.sortModel, 1);
                //     $scope.sortList = $scope.sortList.sort(function(a,b){return a.id - b.id});
                //     if ($scope.sortList.unshift(item)) $scope.sortModel = 0;
                // }
                $scope.sortProjects = item.tag;
            }
        };

        $scope.updateSort = function(){
            var item = $scope.sortList[$scope.sortModel];
        };

        $scope.updateFilter = function(){
            var item = $scope.filterList[$scope.filterModel];
        };

        $scope.oneAtATime = true;

        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.toggleProjectsFlag = function(flag) {
            $scope.setFilter('clear');
            if (flag === "myProjectsFlag" ) {
                $scope.myProjectsFlag = !$scope.myProjectsFlag;
                $scope.activeTab = 'my-projects';
            } else if (flag === "allProjectsFlag") {
                $scope.allProjectsFlag = !$scope.allProjectsFlag;
                $scope.activeTab = 'all-projects';
            }
        };

        $scope.setFilter = function(filter) {
            if (filter === 'public') {
                $scope.filters.public = !$scope.filters.public;
                $scope.activeFilter = 'public';
                $scope.filters.private = false;
            } else if (filter === 'private') {
                $scope.filters.public = false;
                $scope.activeFilter = 'private';
                $scope.filters.private = !$scope.filters.private;
            } else {
                $scope.filters.public = false;
                $scope.activeFilter = null;
                $scope.filters.private = false;
            }

        };

        $scope.rotate = function () {
            $scope.isActive = !$scope.isActive;
        };
        
        $scope.clearSearch = function() {
            $scope.searchTerm = null;
        }

    });
