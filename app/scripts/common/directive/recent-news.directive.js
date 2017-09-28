angular.module('dmc.recent-news',['dmc.ajax','dmc.data'])
  .directive('recentNews', [recentNewsFunc])

function recentNewsFunc() {
  // recentNewsController.$inject = ["$scope"];

  return{
    restrict: 'E',
    templateUrl: 'templates/components/ui-widgets/recent-news.html',
    // controller: recentNewsController
    controller: function($scope, ajax, dataFactory) {
      $scope.deleteNews = function(index, id) {
        ajax.delete(dataFactory.dmdiiProjectNewsUrl(id).delete, {}, function() {
          $scope.news.splice(index, 1);
        });
      };

    }
  }
}
