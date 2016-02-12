angular.module('dmc.project')
.controller('TasksCtrl',
    function ($scope, $rootScope, $state, ajax, dataFactory, $stateParams,$mdDialog, projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

        $scope.projectData = projectCtrl.projectData;
        $scope.projectId = projectCtrl.currentProjectId;
        $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
        $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : "tasks1";

        if($scope.projectData && $scope.projectData.id && $scope.projectId) {
            $scope.tasks = [];
            $scope.order = "ASC";
            $scope.sort = "title";

            $scope.types = [
                {
                    tag: "tasks1",
                    name: "Tasks 1"
                }, {
                    tag: "tasks2",
                    name: "Tasks 2"
                }
            ];

            $scope.getTasks = function () {
                ajax.get(dataFactory.getTasks($scope.projectId), {
                        _sort: ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort),
                        _order: $scope.order,
                        title_like: $scope.searchModel,
                        _type: $scope.typeModel
                    }, function (response) {
                        $scope.tasks = response.data;
                        for (var index in $scope.tasks) {
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

            var convertDueDate = function (task) {
                var oneDay = 86400000;
                task.dueDateForEdit = task.dueDate;
                task.dueDate = moment(task.dueDate, "DD-MM-YYYY").format("MM/DD/YYYY");
                var difference = Math.floor(new Date(task.dueDate) - new Date(moment(new Date()).format("MM/DD/YYYY")));
                if (difference == 0) {
                    task.dueDate = ['today', 'Today'];
                } else if (difference == oneDay) {
                    task.dueDate = ['tomorrow', 'Tomorrow'];
                } else if (difference > oneDay) {
                    task.dueDate = ['date', task.dueDate];
                } else if (difference < 0) {
                    var name_d = (difference == (-1 * oneDay) ? 'day' : 'days');
                    task.dueDate = ['after', 'Due ' + (-1 * Math.floor(difference / oneDay)) + ' ' + name_d + ' ago'];
                }
            };

            $scope.submit = function (text) {
                $scope.searchModel = text;
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.text = $scope.searchModel;
                $state.go('project.tasks', dataSearch, {reload: true});
            };

            $scope.changedType = function (type) {
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.type = type;
                $state.go('project.tasks', dataSearch, {reload: true});
            };
        }

    });