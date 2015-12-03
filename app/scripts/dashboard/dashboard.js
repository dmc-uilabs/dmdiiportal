'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/
angular.module('dmc')
.controller("DashboardCtr",["$scope","mobileFactory",function($scope,mobileFactory){
    $scope.isMobile = mobileFactory.any();
}]);
