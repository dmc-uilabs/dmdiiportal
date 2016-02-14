'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllDiscussionsController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'projectData',
        'previousPage',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    projectData,
                    previousPage,
                    dataFactory) {

            // comeback to the previous page
            $scope.previousPage = previousPage.get();

            $("title").text("View All Discussions");

            $scope.projectData = projectData;
            $scope.projectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : null;
            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : "tasks1";

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
                    $state.go('discussions', dataSearch, {reload: true});
                };

                $scope.changedType = function (type) {
                    var dataSearch = $.extend(true, {}, $stateParams);
                    dataSearch.type = type;
                    $state.go('discussions', dataSearch, {reload: true});
                };
            }
        }
    ]
);