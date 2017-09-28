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

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                // function for get all components from DB
                $scope.getComponents = function(){
                    ajax.get(dataFactory.getComponents($scope.projectId),{
                        _limit : 5,
                        _sort : ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort),
                        _order : $scope.order
                    },function(response){
                        $scope.components = response.data;
                        $scope.total =  $scope.components.length;
                        apply();
                    });
                };

                $scope.onOrderChange = function(order){
                    $scope.sort = order;
                    $scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
                    $scope.getComponents();
                };

                // get all components (first request)
                $scope.getComponents();

            }
        };
    }]);