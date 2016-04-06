'use strict';
angular.module('dmc.add_task',[
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngtimeago',
    'ui.router',
    'dmc.ajax',
    'dmc.model.question-toast-model',
    'dmc.data',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.user'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
    $stateProvider.state('add', {
        url: '/?projectId',
        templateUrl: 'templates/add_task/add_task.html',
        controller: 'AddTaskCtrl'
    });
    $urlRouterProvider.otherwise('/');
}).controller('AddTaskCtrl', [
        "$scope",
        "$rootScope",
        "$state",
        "ajax",
        "dataFactory",
        "$stateParams",
        "$mdDialog",
        "toastModel",
        "questionToastModel",
        function ($scope,
                  $rootScope,
                  $state,
                  ajax,
                  dataFactory,
                  $stateParams,
                  $mdDialog,
                  toastModel,
                  questionToastModel) {

            $rootScope.$on('$stateChangeStart', $mdDialog.cancel);
            if(!$rootScope.projects) ajax.loadProjects();

            $scope.task = {};
            $scope.isCreation = false;

            $scope.selectedProject = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : null;

            $scope.setDatePickerFocus = function(){
                $( ".dueDatePicker input").unbind( "focus" );
                $(".dueDatePicker").on("focus","input",function(){
                    $(".dueDatePicker button").click();
                });
            };

            $scope.priorities = [
                {
                    id : 4,
                    name : "Low"
                }, {
                    id : 3,
                    name : "Medium"
                }, {
                    id : 2,
                    name : "High"
                }, {
                    id : 1,
                    name : "Critical"
                }
            ];

            $scope.users = [];
            $scope.loadUsers = function() {
                ajax.get(dataFactory.getAssignUsers(),{},
                    function(response){
                        $scope.users = response.data;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }
                );
            };
            $scope.loadUsers();

            $scope.cancel = function(){
                $state.go("project.home");
            };

            $scope.createTask = function(){
                $scope.isCreation = true;
                var assignee = null;
                for(var i in $scope.users){
                    if($scope.users[i].id == $scope.task.assigneeId){
                        assignee = $scope.users[i].name;
                        break;
                    }
                }
                ajax.create(dataFactory.createTask(),{
                        "title": $scope.task.title,
                        "description": $scope.task.description,
                        "assignee": assignee,
                        "assigneeId": $scope.task.assigneeId,
                        "reporter": $rootScope.userData.displayName,
                        "reporterId": $rootScope.userData.accountId,
                        "dueDate": Date.parse(!$scope.task.dueDate || $scope.task.dueDate == undefined ? new Date() : $scope.task.dueDate),
                        "priority": $scope.task.priority,
                        "projectId": $scope.selectedProject,
                        "additionalDetails" : $scope.task.additionalDetails,
                        "status" : "Open"
                    }, function(response){
                        $scope.isCreation = false;
                        location.href = "/project.php#/"+$scope.selectedProject+"/task/"+response.data.id;
                        toastModel.showToast("success", "Task successfully added!");
                    },function(){
                        toastModel.showToast("error", "Ajax faild: createTask");
                        $scope.isCreation = false;
                    }
                );
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }


        }
    ]
);