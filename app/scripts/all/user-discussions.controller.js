'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllUserDiscussionsController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    dataFactory) {

            $("title").text("View All Discussions");

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : "tasks1";

                $scope.discussions = [];
                $scope.order = "DESC";
                $scope.sort = "text";

                $scope.types = [
                    {
                        tag: "following",
                        name: "Follow"
                    }, {
                        tag: "follow-people",
                        name: "Follow people"
                    },{
                        tag: "popular",
                        name: "Popular"
                    }
                ];

                $scope.getDiscussions = function () {
                    ajax.get(dataFactory.getAllDiscussions(), {
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
                    $state.go('user-discussions', dataSearch, {reload: true});
                };

                $scope.changedType = function (type) {
                    var dataSearch = $.extend(true, {}, $stateParams);
                    dataSearch.type = type;
                    $state.go('user-discussions', dataSearch, {reload: true});
                };

        }
    ]
);