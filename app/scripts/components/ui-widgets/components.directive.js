'use strict';

angular.module('dmc.widgets.components',[
        'dmc.ajax',
        'dmc.data'
    ]).
    directive('uiWidgetComponents', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/components.html',
            scope: {
                columns: "=",
                widgetTitle: "=",
                widgetStyle: "=",
                projectId: "="
            },
            link: function (scope, iElement, iAttrs) {

            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax) {
                $scope.components = [];
                $scope.total = 0;
                $scope.sort = 'status';
                $scope.order = 'DESC';

                // function for get all components from DB
                $scope.getComponents = function(){
                    ajax.on(dataFactory.getUrlAllComponents($scope.projectId),{
                        projectId : $scope.projectId,
                        sort : $scope.sort,
                        order : $scope.order,
                        offset : 0,
                        limit : 5
                    },function(data){
                        $scope.components = data.result;
                        $scope.total = data.count;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },function(){
                        alert("Ajax faild: getComponents");
                    });
                };

                $scope.onOrderChange = function(order){
                    $scope.sort = (order[0] == '-' ? order.substring(1,order.length) : order);
                    $scope.order = (order[0] == '-' ? 'ASC' : 'DESC');
                    $scope.getComponents();
                };

                // get all components (first request)
                $scope.getComponents();

            }
        };
    }]);