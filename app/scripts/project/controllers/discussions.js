angular.module('dmc.project')
.controller('DiscussionsCtrl',
    function ($rootScope, $scope, ajax, dataFactory, $state, $stateParams,$mdDialog, projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

        $scope.projectData = projectCtrl.projectData;
        $scope.projectId = projectCtrl.currentProjectId;
        $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
        $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : "discussions1";

        if($scope.projectData && $scope.projectData.id && $scope.projectId) {
            $scope.discussions = [];
            $scope.order = "DESC";
            $scope.sort = "text";

            $scope.types = [
                {
                    tag: "discussions1",
                    name: "Discussions 1"
                }, {
                    tag: "discussions2",
                    name: "Discussions 2"
                }
            ];

            $scope.getDiscussions = function () {
                ajax.get(dataFactory.getAllDiscussions($scope.projectId), {
                        _sort: ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort),
                        _order: $scope.order,
                        text_like: $scope.searchModel,
                        _type: $scope.typeModel
                    }, function (response) {
                        $scope.discussions = response.data;
                        apply();
                    }
                );
            };
            $scope.getDiscussions();

            $scope.onOrderChange = function (order) {
                $scope.sort = order;
                $scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
                $scope.getDiscussions();
            };

            var apply = function () {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.submit = function (text) {
                $scope.searchModel = text;
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.text = $scope.searchModel;
                $state.go('project.discussions', dataSearch, {reload: true});
            };

            $scope.changedType = function (type) {
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.type = type;
                $state.go('project.discussions', dataSearch, {reload: true});
            };
        }
    })