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
    'dmc.model.user',
    'dmc.widgets.rich-text'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
    $stateProvider.state('add', {
        url: '/?projectId',
        templateUrl: 'templates/add_task/add_task.html',
        controller: 'AddTaskCtrl'
    });
    $urlRouterProvider.otherwise('/');
}).controller('AddTaskCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        'ajax',
        'dataFactory',
        '$stateParams',
        '$mdDialog',
        'toastModel',
        'questionToastModel',
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


            console.log('in the controller add_task.js')
            $scope.task = {};

            $scope.isCreation = false;

            $scope.selectedProject = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : null;

            $scope.setDatePickerFocus = function(){
                $( '.dueDatePicker input').unbind( 'focus' );
                $('.dueDatePicker').on('focus','input',function(){
                    $('.dueDatePicker button').click();
                });
            };

            $scope.priorities = [
                {
                    id : 4,
                    name : 'Low'
                }, {
                    id : 3,
                    name : 'Medium'
                }, {
                    id : 2,
                    name : 'High'
                }, {
                    id : 1,
                    name : 'Critical'
                }
            ];

            $scope.users = [];


            $scope.getMembers = function () {
                $scope.loading = true;
                $scope.companyNameList = {};
                ajax.get(dataFactory.getProjectMembers(), {projectId: $scope.selectedProject}, function (response) {
                    var profileIds = $.map(response.data, function (x) {
                        return x.profileId;
                    });
                    $scope.users = response.data;
                    ajax.get(dataFactory.profiles().all, {
                        id: profileIds,
                        displayName_like: $scope.searchModel,
                        _type: $scope.typeModel
                    }, function (res) {
                        $scope.loading = false;
                        for(var i in $scope.users){

                            for(var j in res.data){
                                if($scope.users[i].profileId == res.data[j].id){
                                    $scope.users[i].member = res.data[j];


                                    //break;
                                }
                            }
                        }

                        apply();
                    });
                });
            };


            $scope.getMembers();

            $scope.cancel = function(){
                window.history.back();
            };

            $scope.createTask = function(){
                b=$scope.task.assigneeId.split('-');

                $scope.isCreation = true;
                var assignee = null;
                for(var i in $scope.users){
                    if($scope.users[i].profileId == b[1]){
                      console.log($scope.users[i].profileId+' b1 is '+b[1])
                        assignee = $scope.users[i].member.displayName;
                        console.log('setting the asss to '+' b1 is '+$scope.users[i].member.displayName)
                        break;
                    }
                }
                ajax.create(dataFactory.createTask(),{
                        'title': $scope.task.title,
                        'description': $scope.task.description,
                        'assignee': assignee,
                        'assigneeId': b[1],
                        'reporter': $rootScope.userData.displayName,
                        'reporterId': $rootScope.userData.accountId,
                        'dueDate': Date.parse(!$scope.task.dueDate || $scope.task.dueDate == undefined ? new Date() : $scope.task.dueDate),
                        'priority': $scope.task.priority,
                        'projectId': $scope.selectedProject,
                        'additionalDetails' : $scope.task.additionalDetails || '',
                        'status' : 'Open',
                        'more':'more'
                    }, function(response){
                        $scope.isCreation = false;
                        location.href = '/project.php#/'+$scope.selectedProject+'/task/'+response.data.id;
                        toastModel.showToast('success', 'Task successfully added!');
                    },function(){
                        toastModel.showToast('error', 'Ajax faild: createTask');
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
