angular.module('dmc.recent-news',[])
  .directive('recentNews', [recentNewsFunc])

function recentNewsFunc() {
  recentNewsController.$inject = ["$scope"];

  return{
    restrict: 'E',
    scope: {
        news: '='
    },
    templateUrl: 'templates/components/ui-widgets/recent-news.html',
    controller: recentNewsController
  }

  function recentNewsController($scope) {

  }
}
