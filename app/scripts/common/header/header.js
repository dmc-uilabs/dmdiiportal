'use strict';
/**
* dmc.common.header Module
*
* Global Header
*/
angular.module('dmc.common.header', ['ngAnimate'])
.directive('dmcTopHeader', function(){
  return {
    restrict: 'A',
    scope: {
      showNotification: '=',
      activePage: '='
    },
    templateUrl: 'templates/common/header/header-tpl.html',
    controller : function($scope,$state){
        $scope.setDropDown = function(event,width){
            width = $(event.currentTarget).width()+12;
        }

        $scope.openPage = function($event){
            //window.location = url;
        };
    }
  };
});
