'use strict';
/**
* dmc.common.header Module
*
* Global Header
*/
angular.module('dmc.common.header', ['ngAnimate'])
.config(function($animateProvider) {
    $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
})
.directive('dmcTopHeader', ['$window', function($window){
  return {
    restrict: 'A',
    scope: {
      showNotification: '=',
      activePage: '='
    },
    templateUrl: 'templates/common/header/header-tpl.html',
    controller : function($scope){
        $scope.setDropDown = function(event,width){
            width = $(event.currentTarget).width()+12;
        }
        $scope.service_alert = 0;
        $scope.notification = 99;
        $scope.message = 1;
        $scope.userName = $window.givenName || 'DMC Member';
    }
  };
}]);
