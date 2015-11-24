'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/
angular.module('dmc.dashboard', [
        'dmc.mobile',
        'dmc.configs.ngmaterial',
        'dmc.widgets.tasks',
        'dmc.widgets.services',
        'dmc.widgets.projects',
        'dmc.widgets.discussions',
        'ngMdIcons',
        'ui.router',
        'md.data.table',
        'dmc.common.header',
        'dmc.common.footer'
])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('dashboard', {
      url: '',
      abstract: true
    });
  $urlRouterProvider.otherwise('/');
}).controller("DashboardCtr",["$scope","mobileFactory",function($scope,mobileFactory){
    $scope.isMobile = mobileFactory.any();
}]);
