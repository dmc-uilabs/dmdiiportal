'use strict';
/**
* dmc.component.treemenu Module
*
* DMC Tree Menu
*/
angular.module('dmc.component.products-filter', [
]).
  directive('dmcProductsFilter', function(RecursionHelper) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
          treeSource: '='
        },
        templateUrl: 'templates/components/tree-menu/products-filter-tpl.html',
        controller: function($scope){

        }
      };
    }
);

