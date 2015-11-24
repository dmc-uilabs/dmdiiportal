'use strict';
/**
* dmc.component.treemenu Module
*
* DMC Tree Menu
*/
angular.module('dmc.component.treemenu', [
    'RecursionHelper'
]).
  directive('dmcTreeMenu', function(RecursionHelper) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
          treeSource: '='
        },
        templateUrl: 'templates/components/tree-menu/tree-menu-tpl.html',
        controller: function($scope){

        }
      };
    }
)
.directive('dmcMenu',function(RecursionHelper){
    return {
        restrict: 'A',
        scope: {
            menuSource: '='
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

