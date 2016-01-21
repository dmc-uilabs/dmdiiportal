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
            controller: function($scope, $element, $attrs,$mdDialog, socketFactory, dataFactory, ajax) {
                $scope.tasks = [];
                $scope.total = 0;
                $scope.sort = 'priority';
                $scope.order = 'DESC';

                // function for get all tasks from DB
                $scope.getTasks = function(){
                    ajax.on(dataFactory.getUrlAllTasks($scope.projectId),
                        dataFactory.get_request_obj({
                        projectId : $scope.projectId,
                        sort : $scope.sort,
                        order : $scope.order,
                        limit : 5,
                        offset : 0
                    }),function(data){
                        var data = dataFactory.get_result(data);
                        $scope.tasks = data.result;
                        $scope.total = data.count;
                        if($scope.columns.indexOf('dueDate') > -1) {
                            for (var i in $scope.tasks) {
                                if($scope.tasks[i].priority[0] == "after"){
                                    $scope.tasks[i].priority[1] = $scope.tasks[i].priority[1].substring(0,$scope.tasks[i].priority[1].indexOf('(')-1);
                                }
                            }
                        }
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },function(){
                        alert("Ajax faild: getTasks");
                    });
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
                        clickOutsideToClose: false,
                        locals : {
                            projectId : $scope.projectId
                        }
                    }).then(function (answer) {

                    }, function (update) {
                        if(update) $scope.getTasks();
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
            link: function (scope, iElement, iAttrs) {
            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax) {
                $scope.projectTasks = [];
                $scope.sort = 'priority';
                $scope.order = 'DESC';

                $scope.getProjectTasks = function(){
                    ajax.on(dataFactory.getUrlAllTasks($scope.projectId),dataFactory.get_request_obj({
                        projectId: $scope.projectId,
                        sort : $scope.sort,
                        order : $scope.order,
                        limit : 3,
                        offset : 0
                    }),function(data){
                        var data = dataFactory.get_result(data);
                        $scope.projectTasks = data.result;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },function(){
                        alert("Ajax faild: getTasks");
                    });
                };

                $scope.getProjectTasks();

                //socketFactory.on(socketFactory.updated().tasks, function(item){
                //    $scope.getProjectTasks();
                //});
            }
        };
    }]).controller('CreateTaskController',function($scope,$mdDialog,ajax,dataFactory,projectId,$compile, DMCTaskModel){
        $scope.isCreation = false;
        $scope.message = {
            error : false
        };

        $scope.cancel = function() {
            $mdDialog.cancel(false);
        };
        $scope.assignedOption = {
            options: {
                html: true,
                focusOpen: true,
                onlySelectValid: true,
                source: function (request, response) {
                    var data = [
                        "Denis Sobko","Annarita Giani","Husain Rizvi"
                    ];
                    data = $scope.assignedOption.methods.filter(data, request.term);

                    if (!data.length) {
                        data.push({
                            label: 'not found',
                            value: ''
                        });
                    }
                    response(data);
                }
            },
            methods: {}
        };

        $scope.createTask = function(){
            $scope.isCreation = true;
            $scope.message.error = false;
            DMCTaskModel.createTask({
                "title": $scope.description,
                "description": $scope.description,
                "assignee": $scope.assignedTo,
                "reporter": "Jack Graber",
                "dueDate": moment($scope.dueDate).format(),
                "priority": moment($scope.dueDate).format(),
                "projectId": projectId
            }).then(
            function(data){
                $scope.isCreation = false;
                if(data.error == null) {
                    $mdDialog.cancel(true);
                } else {
                    $scope.message.error = true;
                    console.error(data.error);
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            },
            function(){
                $scope.message.error = true;
                alert("Ajax faild: createTask");
                $scope.isCreation = false;
            })

            // ajax.on(dataFactory.getUrlCreateTask(projectId),{
            //     projectId: projectId,
            //     description : $scope.description,
            //     assignee : $scope.assignedTo,
            //     dueDate : moment($scope.dueDate).format()
            // },function(data){
            //     $scope.isCreation = false;
            //     if(data.error == null) {
            //         $mdDialog.cancel(true);
            //     }else{
            //         $scope.message.error = true;
            //         console.error(data.error);
            //     }
            //     if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            // },function(){
            //     $scope.message.error = true;
            //     alert("Ajax faild: createTask");
            //     $scope.isCreation = false;
            // },
            // 'POST');
        };
    });