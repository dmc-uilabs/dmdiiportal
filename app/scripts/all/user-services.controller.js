'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllUserServicesController', [
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


            $("title").text("View All Services");


                $scope.services = [];
                $scope.order = "DESC";
                $scope.sort = "title";

                $scope.getServices = function () {
                    ajax.get(dataFactory.getServices(), {
                            _sort: ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort),
                            _order: $scope.order
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

        }
    ]
);