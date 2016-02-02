'use strict';

angular.module('dmc.widgets.services',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket'
    ]).
    directive('uiWidgetServices', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/services.html',
            scope: {
                columns: "=",
                widgetTitle: "=",
                widgetStyle: "=",
                projectId: "=",
                titleHref: "=",
                viewAllHref: "=",
                startAtOffset: "=",
                sortBy: "="
            },
            link: function (scope, iElement, iAttrs) {

            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel) {
                $scope.services = [];
                $scope.total = 0;
                $scope.sort = 'title';
                $scope.order = 'ASC';

                // function for get all services from DB
                $scope.getServices = function(){
                    ajax.get(dataFactory.getServices($scope.projectId),{
                            _sort : $scope.sort,
                            _order : $scope.order,
                            _limit : 5
                        }, function(response){
                            $scope.services = response.data;
                            $scope.total = $scope.services.length;
                            for(var s in $scope.services){
                                $scope.services[s].releaseDate = moment($scope.services[s].releaseDate,"DD/MM/YYYY").format("MM/DD/YYYY");
                                $scope.services[s].currentStatus.startDate = moment($scope.services[s].currentStatus.startDate,"DD/MM/YYYY").format("MM/DD/YYYY");
                            }
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        },function(response){
                            toastModel.showToast("error", "Ajax faild: getServices");
                        }
                    );
                };

                $scope.onOrderChange = function (order) {
                    $scope.sort = (order[0] == '-' ? order.substring(1,order.length) : order);
                    $scope.order = (order[0] == '-' ? 'DESC' : 'ASC');
                    $scope.getServices();
                };

                // get all services (first request)
                $scope.getServices();

                // Socket listeners -------------------------------------------------

                // get updated service
                //socketFactory.on(socketFactory.updated().services, function(item){
                //    $scope.getServices();
                //});
            }
        };
    }]).
    directive('uiProjectServices', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/project-services.html',
            scope:{
                projectId: "=",
                widgetTitle: "=",
                totalItems: "=",
                progressPosition: "="
            },
            link: function (scope, iElement, iAttrs) {
            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel) {
                $scope.projectServices = [];
                $scope.sort = 'title';
                $scope.order = 'DESC';

                $scope.totalItems = 0;

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                $scope.getProjectServices = function(){
                    ajax.get(dataFactory.getServices($scope.projectId),{
                        _sort : $scope.sort,
                        _order : $scope.order,
                        _limit : 3,
                        _start : 0
                    },function(response){
                        $scope.projectServices = response.data;
                        $scope.totalItems = $scope.projectServices.length;
                        for(var s in $scope.projectServices){
                            $scope.projectServices[s].releaseDate = moment($scope.projectServices[s].releaseDate,"DD/MM/YYYY").format("MM/DD/YYYY");
                        }
                        apply();
                    },function(response){
                        toastModel.showToast("error", "Ajax faild: getProjectServices");
                    });
                };

                $scope.getProjectServices();

                //socketFactory.on(socketFactory.updated().services, function(item){
                //    $scope.getProjectServices();
                //});

            }
        };
    }]);