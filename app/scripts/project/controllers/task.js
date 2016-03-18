angular.module('dmc.project')
    .controller('TaskCtrl', [
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
            $scope.taskId = angular.isDefined($stateParams.taskId) ?$stateParams.taskId : null ;
            $scope.task = null;
            $scope.isEditing = false;

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

            $scope.getTask = function(){
                ajax.get(dataFactory.getTask($scope.taskId),{
                    projectId : $scope.projectId
                },function(response){
                    $scope.task = response.data && response.data.id ? response.data : null;
                    setPriority($scope.task);
                    convertDueDate($scope.task);
                    apply();
                });
            };
            $scope.getTask();

            $scope.editTask = function(){
                $scope.isEditing = true;
            };

            $scope.cancelEditTask = function(){
                $scope.isEditing = false;
            };

            $scope.setStatus = function(){
                var newStatus = null;
                switch($scope.task.status){
                    case "Completed":
                        newStatus = "InProgress";
                        break;
                    case "Open":
                        newStatus = "InProgress";
                        break;
                    case "InProgress":
                        newStatus = "Completed";
                        break;
                    default:
                        break;
                }
                ajax.update(dataFactory.updateTask($scope.task.id),{
                    status : newStatus
                }, function(response){
                    $scope.task.status = response.data.status;
                    apply();
                });
            };

            $scope.deleteTask = function(ev){
                questionToastModel.show({
                    question: "Delete task?",
                    buttons: {
                        ok: function(){
                            ajax.delete(dataFactory.deleteTask($scope.task.id),{},function(){
                                $state.go("project.tasks");
                            });
                        },
                        cancel: function(){}
                    }
                }, ev);
            };

            $scope.saveChanges = function(){
                var assignee = null;
                for(var i in $scope.users){
                    if($scope.users[i].id == $scope.task.assigneeId){
                        assignee = $scope.users[i].name;
                        break;
                    }
                }
                if($scope.task.additionalDetails && $scope.task.additionalDetails.length > 1000){
                    $scope.task.additionalDetails = $scope.task.additionalDetails.substring(0,1000);
                }
                var data = {
                    title : $scope.task.title,
                    dueDate : Date.parse($scope.task.dueDateForEdit),
                    additionalDetails : $scope.task.additionalDetails,
                    assignee : assignee,
                    assigneeId : $scope.task.assigneeId,
                    priority : $scope.task.priority
                };
                ajax.update(dataFactory.updateTask($scope.task.id),data, function(response){
                    $scope.task = response.data;
                    setPriority($scope.task);
                    convertDueDate($scope.task);
                    apply();
                    toastModel.showToast("success", "Task successfully updated");
                    $scope.cancelEditTask();
                });
            };

            $scope.$watch(function(){
                return $(".md-datepicker-calendar-pane.md-pane-open").size();
            },function(newVal,oldVal){
                if($scope.task) {
                    if (newVal == null || newVal == 0) {
                        $scope.task.dueDateFocused = false;
                    } else {
                        $scope.task.dueDateFocused = true;
                    }
                    apply();
                }
            });

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

            var setPriority = function(task){
                switch(task.priority){
                    case 1:
                        task.priorityName = "Critical";
                        break;
                    case 2:
                        task.priorityName = "High";
                        break;
                    case 3:
                        task.priorityName = "Medium";
                        break;
                    case 4:
                        task.priorityName = "Low";
                        break;
                    default:
                        break;
                }
            };

            var convertDueDate = function(task){
                var oneDay = 86400000;
                task.dueDateForEdit = new Date(moment(task.dueDate).format("MM/DD/YYYY"));
                var difference = Math.floor(new Date(task.dueDate) - new Date(moment(new Date()).format("MM/DD/YYYY")));
                if(difference == 0) {
                    task.formatedDueDate = ['today','Today'];
                } else if(difference == oneDay) {
                    task.formatedDueDate = ['tomorrow','Tomorrow'];
                }else if(difference > oneDay){
                    task.formatedDueDate = ['date',moment(new Date(task.dueDate)).format("MM/DD/YYYY")];
                }else if(difference < 0){
                    var name_d = (difference == (-1*oneDay) ? 'day' : 'days');
                    task.formatedDueDate = ['after', 'Due ' + (-1 * Math.floor(difference / oneDay)) + ' ' + name_d + ' ago'];
                }
            };


        }
    ]
);