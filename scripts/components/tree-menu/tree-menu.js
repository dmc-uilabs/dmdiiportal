'use strict';
/**
* dmc.component.treemenu Module
*
* DMC Tree Menu
*/
angular.module('dmc.component.treemenu', [
    'RecursionHelper'
]).
  directive('dmcTreeMenu', [ 'RecursionHelper', '$window', function(RecursionHelper, $window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
          treeSource: '='
        },
        templateUrl: 'templates/components/tree-menu/tree-menu-tpl.html',
        controller: function($scope){
            $scope.clearUrl = $window.location.href.split('?')[0];
        }
      };
  }]
)
.directive('dmcMenu', function(RecursionHelper){
    return {
        restrict: 'A',
        scope: {
            menuSource: '=',
            selected: '='
        },
        templateUrl: 'templates/components/tree-menu/menu-tpl.html',
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
            });
        },
        controller: function($scope){
        }
    };
});
