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
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax) {
                $scope.services = [];
                $scope.total = 0;
                $scope.sort = 'status';
                $scope.order = 'DESC';

                // function for get all services from DB
                $scope.getServices = function(){
                    ajax.on(dataFactory.getUrlAllServices($scope.projectId),{
                        projectId : $scope.projectId,
                        sort : $scope.sortBy || 0,
                        order : $scope.order,
                        offset : $scope.startAtOffset || 0,
                        limit : 5
                    },function(data){
                        $scope.services = data.result;
                        $scope.total = data.count;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },function(){
                        alert("Ajax faild: getServices");
                    });
                };

                $scope.onOrderChange = function(order){
                    $scope.sort = (order[0] == '-' ? order.substring(1,order.length) : order);
                    $scope.order = (order[0] == '-' ? 'ASC' : 'DESC');
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
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax) {
                $scope.projectServices = [];
                $scope.sort = 'status';
                $scope.order = 'DESC';

                $scope.totalCount = 0;

                $scope.getProjectServices = function(){
                    ajax.on(dataFactory.getUrlAllServices($scope.projectId),{
                        projectId: $scope.projectId,
                        sort : $scope.sort,
                        order : $scope.order,
                        limit : 3,
                        offset : 0
                    },function(data){
                        $scope.projectServices = data.result;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },function(){
                        alert("Ajax faild: getProjectServices");
                    });
                };

                $scope.getProjectServices();

                //socketFactory.on(socketFactory.updated().services, function(item){
                //    $scope.getProjectServices();
                //});

            }
        };
    }]);