'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllServicesController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'projectData',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    projectData,
                    dataFactory) {


            $("title").text("View All Services");

            $scope.projectData = projectData;
            $scope.projectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : null;
            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : "tasks";

            if($scope.projectData && $scope.projectData.id && $scope.projectId) {
                $scope.services = [];
                $scope.order = "DESC";
                $scope.sort = "title";

                $scope.types = [
                    {
                        tag: "people1",
                        name: "People 1"
                    }, {
                        tag: "people2",
                        name: "People 2"
                    }
                ];

                $scope.getServices = function () {
                    ajax.get(dataFactory.getServices($scope.projectId), {
                            _sort: ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort),
                            _order: $scope.order,
                            title_like: $scope.searchModel,
                            _type: $scope.typeModel
                        }, function (response) {
                            $scope.services = response.data;
                            for(var i in $scope.services){
                                $scope.services[i].releaseDate = moment($scope.services[i].releaseDate,"DD/MM/YYYY").format("MM/DD/YYYY");
                            }
                            apply();
                        }
                    );
                };
                $scope.getServices();

                $scope.onOrderChange = function (order) {
                    $scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
                    $scope.getServices();
                };

                var apply = function () {
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                $scope.submit = function (text) {
                    $scope.searchModel = text;
                    var dataSearch = $.extend(true, {}, $stateParams);
                    delete dataSearch.projectId;
                    dataSearch.text = $scope.searchModel;
                    $location.path('/services/'+$scope.projectId).search(dataSearch);
                };

                $scope.changedType = function (type) {
                    var dataSearch = $.extend(true, {}, $stateParams);
                    delete dataSearch.projectId;
                    dataSearch.type = type;
                    $location.path('/services/'+$scope.projectId).search(dataSearch);
                };
            }
        }
    ]
);