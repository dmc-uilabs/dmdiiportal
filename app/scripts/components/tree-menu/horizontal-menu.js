'use strict';
/**
* dmc.component.treemenu Module
*
* DMC Tree Menu
*/
angular.module('dmc.component.horizontalmenu', [
    'RecursionHelper'
]).
  directive('dmcHorizontalMenu', ['$window', function($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
          treeSource: '='
        },
        templateUrl: 'templates/components/tree-menu/horizontal-menu-tpl.html',
        controller: function($scope, $document, $element){
            $scope.clearUrl = $window.location.href.split('?')[0];

            $scope.makeFilterName = function(s){
              return s.replace(/ /g,'');
            }

            $scope.isPopupVisible = false;

            $scope.toggleDropdown = function(){
              $scope.isPopupVisible = !$scope.isPopupVisible;
            }

            console.log($element.find('.dropdown'));

            $element.find('.dropdown').on('hide.bs.dropdown', function () {
              console.log('hello');
            });
        }
      };
  }]
)
