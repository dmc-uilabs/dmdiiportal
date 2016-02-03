'use strict';

angular.module('dmc.widgets.tasks',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket',
        'dmc.model.task',
        'ui.autocomplete',
        'ngSanitize'
    ]).
    directive('uiWidgetTasks', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/tasks.html',
            scope: {
                columns: "=",
                widgetTitle: "=",
                projectId: "="
            },
            link: function (scope, iElement, iAttrs) {
            },
            controller: function($scope, $element, $attrs,$mdDialog, socketFactory, dataFactory, ajax, toastModel) {
                $scope.tasks = [];
                $scope.total = 0;
                $scope.sort = 'dueDate';
                $scope.order = 'DESC';

                // function for get all tasks from DB
                $scope.getTasks = function(){
                    ajax.get(dataFactory.getTasks($scope.projectId),{
                            _sort : $scope.sort,
                            _order : $scope.order,
                            _limit : 5
                        }, function(response){
                            $scope.tasks = response.data;
                            $scope.total = $scope.tasks.length;
                            for(var index in $scope.tasks){
                                convertDueDate($scope.tasks[index]);
                            }
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        },function(){
                            toastModel.showToast("error", "Ajax faild: getTasks");
                        }
                    );
                };

                var convertDueDate = function(task){
                    var oneDay = 86400000;
                    task.dueDateForEdit = task.dueDate;
                    task.dueDate = moment(task.dueDate,"DD-MM-YYYY").format("MM/DD/YYYY");
                    var difference = Math.floor(new Date(task.dueDate) - new Date(moment(new Date()).format("MM/DD/YYYY")));
                    if(difference == 0) {
                        task.dueDate = ['today','Today'];
                    } else if(difference == oneDay) {
                        task.dueDate = ['tomorrow','Tomorrow'];
                    }else if(difference > oneDay){
                        task.dueDate = ['date',task.dueDate];
                    }else if(difference < 0){
                        var name_d = (difference == (-1*oneDay) ? 'day' : 'days');
                        task.dueDate = ['after', 'Due ' + (-1 * Math.floor(difference / oneDay)) + ' ' + name_d + ' ago'];
                    }
                };

                $scope.onOrderChange = function (order) {
                    $scope.sort = (order[0] == '-' ? order.substring(1,order.length) : order);
                    $scope.order = (order[0] == '-' ? 'ASC' : 'DESC');
                    $scope.getTasks();
                };

                // get all tasks (first request)
                $scope.getTasks();

                // Socket listeners -------------------------------------------------

                // get updated tasks
                //socketFactory.on(socketFactory.updated().tasks, function(item){
                //    $scope.getTasks();
                //});

                $scope.newTask = function(ev){
                    $mdDialog.show({
                        controller: "CreateTaskController",
                        templateUrl: 'templates/components/dialogs/create-task-tpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals : {
                            projectId : $scope.projectId
                        }
                    }).then(function (answer) {

                    }, function (update) {
                        if(update) $scope.getTasks();
                    });
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
                    }).then(function (answer) {

                    }, function (update) {
                        if(update) {
                            for (var t in $scope.tasks) {
                                if ($scope.tasks[t].id == update.id) {
                                    $scope.tasks[t] = update;
                                    convertDueDate($scope.tasks[t]);
                                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                                    break;
                                }
                            }
                        }
                    });
                };
            }
        };
    }]).
    directive('uiProjectTasks', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/project-tasks.html',
            scope:{
                projectId: "=",
                widgetTitle: "=",
                totalItems: "="
            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel,$mdDialog) {
                $scope.projectTasks = [];
                $scope.sort = 'priority';
                $scope.order = 'DESC';
                $scope.totalItems = 0;

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                var convertDueDate = function(task){
                    var oneDay = 86400000;
                    task.dueDateForEdit = task.dueDate;
                    task.dueDate = moment(task.dueDate,"DD-MM-YYYY").format("MM/DD/YYYY");
                    var difference = Math.floor(new Date(task.dueDate) - new Date(moment(new Date()).format("MM/DD/YYYY")));
                    if(difference == 0) {
                        task.dueDate = ['today','Today'];
                    } else if(difference == oneDay) {
                        task.dueDate = ['tomorrow','Tomorrow'];
                    }else if(difference > oneDay){
                        task.dueDate = ['date',task.dueDate];
                    }else if(difference < 0){
                        var name_d = (difference == (-1*oneDay) ? 'day' : 'days');
                        task.dueDate = ['after', 'Due ' + (-1 * Math.floor(difference / oneDay)) + ' ' + name_d + ' ago'];
                    }
                };

                $scope.getProjectTasks = function(){
                    ajax.get(dataFactory.getTasks($scope.projectId),{
                        _sort : $scope.sort,
                        _order : $scope.order,
                        _limit : 3,
                        _start : 0
                    },function(response){
                        $scope.projectTasks = response.data;
                        $scope.totalItems = $scope.projectTasks.length;
                        for(var t in $scope.projectTasks){
                            convertDueDate($scope.projectTasks[t]);
                        }
                        apply();
                    },function(){
                        toastModel.showToast("error", "Ajax faild: getProjectTasks");
                    });
                };

                $scope.getProjectTasks();

                //socketFactory.on(socketFactory.updated().tasks, function(item){
                //    $scope.getProjectTasks();
                //});

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
                            if(update) {
                                for (var t in $scope.projectTasks) {
                                    if ($scope.projectTasks[t].id == update.id) {
                                        $scope.projectTasks[t] = update;
                                        convertDueDate($scope.projectTasks[t]);
                                        apply();
                                        break;
                                    }
                                }
                            }
                        }
                    );
                };
            }
        };
    }]).controller('CreateTaskController',function($scope,$mdDialog,ajax,dataFactory,projectId,$compile,toastModel){
        $scope.isCreation = false;

        $scope.priorities = ["Low", "Medium", "High", "Critical"];

        $scope.message = {
            error : false
        };

        $scope.cancel = function() {
            $mdDialog.cancel(false);
        };

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

        $scope.createTask = function(){
            $scope.isCreation = true;
            $scope.message.error = false;
            ajax.create(dataFactory.createTask(),{
                    "title": $scope.description,
                    "description": $scope.description,
                    "assignee": $scope.assignedTo,
                    "reporter": "Jack Graber",
                    "dueDate": moment($scope.dueDate).format("DD-MM-YYYY HH:mm:ss"),
                    "priority": $scope.priorityModel,
                    "projectId": projectId,
                    "status" : "Open"
                }, function(response){
                    $scope.isCreation = false;
                    $mdDialog.cancel(true);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    toastModel.showToast("success", "Task successfully added!");
                },function(){
                    $scope.message.error = true;
                    toastModel.showToast("error", "Ajax faild: createTask");
                    $scope.isCreation = false;
                }
            );
        };

    }).controller('EditTaskController',function($scope,$mdDialog,ajax,dataFactory,$compile,task,$http,toastModel){
        $scope.task = $.extend(true,{},task);
        $scope.task.dueDateForEdit = new Date(moment($scope.task.dueDateForEdit,"DD-MM-YYYY").format("MM/DD/YYYY"));
        $scope.priorities = ["Low", "Medium", "High", "Critical"];

        $scope.statuses = ["Open","Completed"];

        $scope.cancel = function() {
            $mdDialog.cancel(false);
        };

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

        $scope.updateTask = function(){
            ajax.update(dataFactory.updateTask($scope.task.id),{
                    "title": $scope.task.description,
                    "description": $scope.description,
                    "assignee": $scope.task.assignee,
                    "dueDate": moment($scope.task.dueDateForEdit).format("DD-MM-YYYY HH:mm:ss"),
                    "priority": $scope.task.priority,
                    "status": $scope.task.status
                }, function(response){
                    $scope.task = response.data;
                    $mdDialog.cancel($scope.task);
                    toastModel.showToast("success", "Task successfully updated!");
                }
            );
        };
    });