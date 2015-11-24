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
.directive('dmcTopHeader', function(){
  return {
    restrict: 'A',
    scope: {
      showNotification: '=',
      activePage: '='
    },
    templateUrl: 'templates/common/header/header-tpl.html',
    controller : function($scope){

    }
  };
});
