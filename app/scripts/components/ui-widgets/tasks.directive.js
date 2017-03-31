'use strict';

angular.module('dmc.widgets.tasks',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket',
        'dmc.model.task',
        'ui.autocomplete',
        'ngSanitize',
        'dmc.model.previous-page'
    ]).
    directive('uiWidgetTasks', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/tasks.html',
            scope: {
                columns: '=',
                widgetTitle: '=',
                projectId: '=',
                limit: '=',
                showTaskModal: '='
            },
            controller: function($scope, $element, $attrs,$mdDialog, socketFactory, dataFactory, ajax, toastModel, previousPage) {
                $scope.tasks = [];
                $scope.total = 0;
                $scope.sort = 'dueDate';
                $scope.order = 'ASC';
                var limit = $scope.limit ? $scope.limit : 5;

                $scope.previousPage = previousPage;

                // function for get all tasks from DB
                $scope.getTasks = function(){
                    ajax.get(dataFactory.getTasks($scope.projectId),{
                            _sort : $scope.sort,
                            _order : $scope.order,
                            status_ne: 'Completed'
                        }, function(response){
                            $scope.total = response.data.length;
                            $scope.tasks = response.data;
                            if($scope.total > limit) $scope.tasks.splice(limit,$scope.total);
                            for(var index in $scope.tasks){
                                setPriority($scope.tasks[index]);
                                convertDueDate($scope.tasks[index]);
                            }
                            if ($scope.showTaskModal) {
                                var task = getTaskById($scope.showTaskModal);
                                $scope.showTaskModal = false;
                                if (task) {
                                    $scope.editTask({}, task)
                                }
                            }
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        },function(){
                            toastModel.showToast('error', 'Ajax faild: getTasks');
                        }
                    );
                };

                var getTaskById = function(id) {
                    return _.find($scope.tasks, function(o){ return o.id == id});
                }

                var setPriority = function(task){
                    switch(task.priority){
                        case 1:
                            task.priorityName = 'Critical';
                            break;
                        case 2:
                            task.priorityName = 'High';
                            break;
                        case 3:
                            task.priorityName = 'Medium';
                            break;
                        case 4:
                            task.priorityName = 'Low';
                            break;
                        default:
                            break;
                    }
                };

                var convertDueDate = function(task){
                    var oneDay = 86400000;
                    task.dueDateForEdit = task.dueDate;
                    var difference = Math.floor(new Date(task.dueDate) - new Date(moment(new Date()).format('MM/DD/YYYY')));
                    if(difference == 0) {
                        task.formatedDueDate = ['today','Today'];
                    } else if(difference == oneDay) {
                        task.formatedDueDate = ['tomorrow','Tomorrow'];
                    }else if(difference > oneDay){
                        task.formatedDueDate = ['date',moment(new Date(task.dueDate)).format('MM/DD/YYYY')];
                    }else if(difference < 0){
                        var name_d = (difference == (-1*oneDay) ? 'day' : 'days');
                        task.formatedDueDate = ['after', 'Due ' + (-1 * Math.floor(difference / oneDay)) + ' ' + name_d + ' ago'];
                    }
                };

                $scope.onOrderChange = function (order) {
                    $scope.sort = order;
                    //$scope.sort = (order[0] == '-' ? order.substring(1,order.length) : order);
                    //$scope.order = (order[0] == '-' ? 'ASC' : 'DESC');
                    //$scope.getTasks();
                };

                // get all tasks (first request)
                $scope.getTasks();

                // Socket listeners -------------------------------------------------

                // get updated tasks
                //socketFactory.on(socketFactory.updated().tasks, function(item){
                //    $scope.getTasks();
                //});

                $scope.newTask = function(ev){
                    if($scope.projectId > 0) {
                        location.href = '/project.php#/' + $scope.projectId + '/add-task';
                    }
                    //$mdDialog.show({
                    //    controller: "CreateTaskController",
                    //    templateUrl: 'templates/components/dialogs/create-task-tpl.html',
                    //    parent: angular.element(document.body),
                    //    targetEvent: ev,
                    //    clickOutsideToClose: true,
                    //    locals : {
                    //        projectId : $scope.projectId
                    //    }
                    //}).then(function (answer) {
                    //
                    //}, function (update) {
                    //    if(update) $scope.getTasks();
                    //});
                };

                $scope.editTask = function(ev,task){
                    $mdDialog.show({
                        controller: 'EditTaskController',
                        templateUrl: 'templates/components/dialogs/edit-task-tpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals : {
                            task : task
                        }
                    }).then(function (answer) {

                    }, function (update) {
                        $scope.getTasks();
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
                projectId: '=',
                widgetTitle: '=',
                totalItems: '=',
                limit: '='
            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel,$mdDialog, previousPage) {
                $scope.previousPage = previousPage;

                $scope.projectTasks = [];
                $scope.sort = 'dueDate';
                $scope.order = 'ASC';
                $scope.totalItems = 0;
                var limit = $scope.limit ? $scope.limit : 3;

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                var setPriority = function(task){
                    switch(task.priority){
                        case 1:
                            task.priorityName = 'Critical';
                            break;
                        case 2:
                            task.priorityName = 'High';
                            break;
                        case 3:
                            task.priorityName = 'Medium';
                            break;
                        case 4:
                            task.priorityName = 'Low';
                            break;
                        default:
                            break;
                    }
                };

                var convertDueDate = function(task){
                    var oneDay = 86400000;
                    task.dueDateForEdit = task.dueDate;
                    var difference = Math.floor(new Date(task.dueDate) - new Date(moment(new Date()).format('MM/DD/YYYY')));
                    if(difference == 0) {
                        task.formatedDueDate = ['today','Today'];
                    } else if(difference == oneDay) {
                        task.formatedDueDate = ['tomorrow','Tomorrow'];
                    }else if(difference > oneDay){
                        task.formatedDueDate = ['date',moment(new Date(task.dueDate)).format('MM/DD/YYYY')];
                    }else if(difference < 0){
                        var name_d = (difference == (-1*oneDay) ? 'day' : 'days');
                        task.formatedDueDate = ['after', 'Due ' + (-1 * Math.floor(difference / oneDay)) + ' ' + name_d + ' ago'];
                    }
                };

                $scope.getProjectTasks = function(){
                    ajax.get(dataFactory.getTasks($scope.projectId),{
                        _sort : $scope.sort,
                        _order : $scope.order,
                        status_ne: 'Completed'
                    },function(response){
                        $scope.totalItems = response.data.length;
                        $scope.projectTasks = response.data;
                        if($scope.totalItems > limit) $scope.projectTasks.splice(limit,$scope.totalItems);
                        for(var t in $scope.projectTasks){
                            setPriority($scope.projectTasks[t]);
                            convertDueDate($scope.projectTasks[t]);
                        }
                        apply();
                    },function(){
                        toastModel.showToast('error', 'Ajax faild: getProjectTasks');
                    });
                };

                $scope.getProjectTasks();

                //socketFactory.on(socketFactory.updated().tasks, function(item){
                //    $scope.getProjectTasks();
                //});

                $scope.editTask = function(ev,task){
                    $mdDialog.show({
                        controller: 'EditTaskController',
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
    }]).controller('CreateTaskController',function($scope,$mdDialog,ajax,dataFactory,projectId,$compile,toastModel,$rootScope){
        $scope.isCreation = false;

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

        $scope.message = {
            error : false
        };

        $scope.cancel = function() {
            $mdDialog.cancel(false);
        };

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

        $scope.createTask = function(){
            $scope.isCreation = true;
            $scope.message.error = false;
            var assignee = null;
            for(var i in $scope.users){
                if($scope.users[i].id == $scope.assignedTo){
                    assignee = $scope.users[i].name;
                    break;
                }
            }
            ajax.create(dataFactory.createTask(),{
                    'title': $scope.description,
                    'description': $scope.description,
                    'assignee': assignee,
                    'assigneeId': $scope.assignedTo,
                    'reporter': $rootScope.userData.displayName,
                    'reporterId': $rootScope.userData.accountId,
                    'dueDate': Date.parse($scope.dueDate),
                    'priority': $scope.priorityModel,
                    'projectId': projectId,
                    'status' : 'Open'
                }, function(response){
                    $scope.isCreation = false;
                    $mdDialog.cancel(true);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    toastModel.showToast('success', 'Task successfully added!');
                },function(){
                    $scope.message.error = true;
                    toastModel.showToast('error', 'Ajax faild: createTask');
                    $scope.isCreation = false;
                }
            );
        };

    }).controller('EditTaskController',function($scope,$mdDialog,ajax,dataFactory,$compile,task,$http,toastModel){
        $scope.task = $.extend(true,{},task);
        $scope.task.dueDateForEdit = new Date(moment($scope.task.dueDateForEdit).format('MM/DD/YYYY'));
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

        $scope.statuses = ['Open','Completed'];

        $scope.cancel = function() {
            $mdDialog.cancel(false);
        };

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


        $scope.updateTask = function(){
            var assignee = null;
            for(var i in $scope.users){
                if($scope.users[i].id == $scope.task.assigneeId){
                    assignee = $scope.users[i].name;
                    break;
                }
            }
            ajax.update(dataFactory.updateTask($scope.task.id),{
                    'title': $scope.task.title,
                    'description': $scope.task.title,
                    'assignee': assignee,
                    'assigneeId': $scope.task.assigneeId,
                    'dueDate': Date.parse($scope.task.dueDateForEdit),
                    'priority': $scope.task.priority,
                    'status': $scope.task.status
                }, function(response){
                    $scope.task = response.data;
                    $mdDialog.cancel($scope.task);
                    toastModel.showToast('success', 'Task successfully updated!');
                }
            );
        };
    });
