'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllUserTasksController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'previousPage',
        '$mdDialog',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    previousPage,
                    $mdDialog,
                    dataFactory) {

            // comeback to the previous page
            $scope.previousPage = previousPage.get();

            $("title").text("All My Tasks");
            if($scope.previousPage.tag != "community"){
                $scope.previousPage = {
                    tag : "dashboard",
                    title: "Back to Dashboard",
                    url: location.origin+'/dashboard.php'
                }
            }
            $(".bottom-header .active-page").removeClass("active-page");
            if($scope.previousPage.tag == "dashboard"){
                $(".dashboard-header-button").addClass("active-page");
            }else if($scope.previousPage.tag == "my-projects"){
                $(".projects-header-button").addClass("active-page");
            }

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : "task";

            $scope.tasks = [];
            $scope.order = "ASC";
            $scope.sort = "dueDate";

            $scope.types = [
                {
                    tag: "task",
                    name: "Task"
                }, {
                    tag: "project",
                    name: "Project"
                }, {
                    tag: "assignedTo",
                    name: "Assigned To"
                }, {
                    tag: "dueDate",
                    name: "Due Date"
                }, {
                    tag: "status",
                    name: "Status"
                }
            ];

            $scope.getTasks = function () {
                ajax.get(dataFactory.getMyTasks(), {
                        _sort: ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort),
                        _order: $scope.order,
                        title_like: $scope.searchModel,
                        _type: $scope.typeModel,
                        status_ne: "Completed"
                    }, function (response) {
                        $scope.tasks = response.data;
                        for (var index in $scope.tasks) {
                            setPriority($scope.tasks[index]);
                            convertDueDate($scope.tasks[index]);
                        }
                        apply();
                    }
                );
            };
            $scope.getTasks();

            $scope.onOrderChange = function (order) {
                $scope.sort = order;
                $scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
                $scope.getTasks();
            };

            var apply = function () {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

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
                task.dueDateForEdit = task.dueDate;
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

            $scope.submit = function (text) {
                $scope.searchModel = text;
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.text = $scope.searchModel;
                $state.go('user-tasks', dataSearch, {reload: true});
            };

            $scope.changedType = function (type) {
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.type = type;
                $state.go('user-tasks', dataSearch, {reload: true});
            };

            $scope.editTask = function(ev,task){
                $mdDialog.show({
                    controller: "EditTaskController",
                    templateUrl: 'templates/components/dialogs/edit-task-tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals : {
                        task : task
                    }
                }).then(function (answer) {},
                    function (update) {
                        $scope.getTasks();
                    }
                );
            };

            $scope.newTask = function(ev){
                $mdDialog.show({
                    controller: "SelectProjectController",
                    templateUrl: 'templates/components/select-project/select-project.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals : {
                    }
                }).then(function (answer) {},
                    function (update) {

                    }
                );
            };
        }
    ]
);
