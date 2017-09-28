angular.module('dmc.more-less',['ng-showdown',])
  .directive('moreLess', [moreLessFunc])

function moreLessFunc() {
  moreLessController.$inject = ["$scope"];

  return{
    restrict: 'A',
    scope: {
      elementText: '@',
      elementTextLimit: '@'
    },
    templateUrl: 'templates/components/ui-widgets/more-less.html',
    controller: moreLessController
  }

  function moreLessController($scope) {

    $scope.textLimitFilter = $scope.elementTextLimit ? $scope.elementTextLimit : 140;
    $scope.elementTextLimitPrompt = 'more';

    $scope.switchLenLimit = function() {

      if ($scope.textLimitFilter == $scope.elementText.length) {
        $scope.textLimitFilter = $scope.elementTextLimit
        $scope.elementTextLimitPrompt = 'more';
      } else {
        $scope.textLimitFilter = $scope.elementText.length;
        $scope.elementTextLimitPrompt = 'less';
      }
    }

    $scope.elementTextTooLong = function() {
      return $scope.elementTextLimit < $scope.elementText.length;
    }

  }
}
