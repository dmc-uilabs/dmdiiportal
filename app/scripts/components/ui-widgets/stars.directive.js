'use strict';

angular.module('dmc.widgets.stars',[

])
    .directive('uiWidgetStarsActive', [function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/components/ui-widgets/stars.html',
            transclude: true,
            replace: true,
            scope: {
                size: "@",
                text: "@",
                selectStar: "&"
            },
            controller: function($scope, $attrs) {
                var choose_star = 0;
                if(!$scope.size || isNaN(parseInt($scope.size, 10))){
                    $scope.size = 14;
                    $attrs.size = 14;
                }

                $scope.StarStyle = [
                    {"fill" : "#c7c7c7"},
                    {"fill" : "#c7c7c7"},
                    {"fill" : "#c7c7c7"},
                    {"fill" : "#c7c7c7"},
                    {"fill" : "#c7c7c7"}
                ];

                $scope.MoveStar = function(val){
                    for(var i=0; i < 5; i++){
                        if(i < val){
                            $scope.StarStyle[i] = {"fill" : "#f28e1e"};
                        }else{
                            $scope.StarStyle[i] = {"fill" : "#c7c7c7"};
                        }
                    }
                };

                $scope.LeaveStar = function(){
                    for(var i=0; i < 5; i++){
                        if(i < choose_star){
                            $scope.StarStyle[i] = {"fill" : "#f28e1e"};
                        }else{
                            $scope.StarStyle[i] = {"fill" : "#c7c7c7"};
                        }
                    }
                };

                $scope.ClickStar = function(val){
                    choose_star = val;
                    for(var i=0; i < val; i++){
                        $scope.StarStyle[i] = {"fill" : "#f28e1e"};
                    }
                    $scope.selectStar({star:choose_star});
                }
            }
        };
    }])
    .directive('uiWidgetStarsStatic', [function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/components/ui-widgets/stars.html',
            transclude: true,
            replace: true,
            scope: {
                size: "@",
                text: "@",
                value: "@"
            },
            controller: function($scope, $attrs) {
                if(!$scope.size || isNaN(parseInt($scope.size, 10))){
                    $scope.size = 14;
                    $attrs.size = 14;
                }

                $scope.StarStyle = [
                    {"fill" : "#c7c7c7"},
                    {"fill" : "#c7c7c7"},
                    {"fill" : "#c7c7c7"},
                    {"fill" : "#c7c7c7"},
                    {"fill" : "#c7c7c7"}
                ];

                if(!$scope.size || isNaN(parseInt($scope.size, 10))){
                    $scope.value = 0;
                    $attrs.value = 0;
                }
                if($scope.value > 5){
                    $scope.value = 5;
                }

                for(var i=0; i < $scope.value; i++){
                    $scope.StarStyle[i] = {"fill" : "#f28e1e"};
                }

                $scope.$watch(
                    function() { return $scope.value; },
                    function(newValue, oldValue) {
                        if ( newValue !== oldValue ) {
                                      
                            $scope.StarStyle = [
                                {"fill" : "#c7c7c7"},
                                {"fill" : "#c7c7c7"},
                                {"fill" : "#c7c7c7"},
                                {"fill" : "#c7c7c7"},
                                {"fill" : "#c7c7c7"}
                            ];
                            for(var i=0; i < $scope.value; i++){
                                $scope.StarStyle[i] = {"fill" : "#f28e1e"};
                            }
                          }
                    }
                );
            }
        };
    }]);