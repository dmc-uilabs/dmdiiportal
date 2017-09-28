'use strict';

angular.module('dmc.widgets.contentPath',[
        'dmc.ajax',
        'dmc.data',
        'ngAnimate',
        'ngSanitize'
    ])
.directive('uiWidgetContentPath', ['$parse', function ($parse) {

  return {
      restrict: 'A',
      templateUrl: '/templates/components/ui-widgets/content-path.html',
      scope: {
          contentNode: '='
          , isLast: '='
          , serviceMap: '='
          , addToStack: "&"
          , moveUpStack: "&"
      },
      controller: function($scope) {
        $scope.selectResourceGroup = function(contentNode, resourceGroup) {
          contentNode.selectedNode = resourceGroup;
        }

        $scope.returnToHome = function(contentNode) {
          contentNode.selectedNode = null;
        }
      }
  };
  //
  // function UiWidgetContentPathController(ajax, dataFactory) {
  //   var vm = this;
  //
  //   vm.selectResourceNode = function(selectedNode) {
  //     vm.selectedNode = selectedNode;
  //   }
  //
  //   vm.returnToHome = function() {
  //     vm.selectedNode = null;
  //   }
  //
  // };
}])
