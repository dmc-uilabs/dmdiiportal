angular.module('dmc.project')
    .controller('AddTaskCtrl', [
        "$scope",
        "$rootScope",
        "$state",
        "ajax",
        "dataFactory",
        "$stateParams",
        "$mdDialog",
        "projectData",
        "toastModel",
        "questionToastModel",
        function ($scope,
                  $rootScope,
                  $state,
                  ajax,
                  dataFactory,
                  $stateParams,
                  $mdDialog,
                  projectData,
                  toastModel,
                  questionToastModel) {
            var projectCtrl = this;
            projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
            projectCtrl.projectData = projectData;

            $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

            $scope.projectData = projectCtrl.projectData;
            $scope.projectId = projectCtrl.currentProjectId;

            $scope.task = {};
            $scope.isCreation = false;

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
                        "dueDate": Date.parse($scope.task.dueDate),
                        "priority": $scope.task.priority,
                        "projectId": $scope.projectId,
                        "additionalDetails" : $scope.task.additionalDetails,
                        "status" : "Open"
                    }, function(response){
                        $scope.isCreation = false;
                        $state.go("project.task",{taskId:response.data.id});
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