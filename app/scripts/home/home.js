'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/
angular.module('dmc.home', ['dmc.configs.ngmaterial', 'ngMdIcons', 'ui.router', 'md.data.table', 'dmc.common.header', 'dmc.common.footer'])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url: '',
      abstract: true
    });
  $urlRouterProvider.otherwise('/');
}).controller('HomeCtr',['$scope',function($scope){
    $scope.pages = [
        {
            name : "My Dashboard",
            text : "Design Solutions",
            href : "dashboard.php",
            img : "home-dashboard-icon.png"
        },
        {
            name : "Marketplace",
            text : "Find Solutions",
            href : "marketplace.php",
            img : "home-market-icon.png"
        },
        {
            name : "Community",
            text : "Find People",
            href : "",
            img : "home-community-icon.png"
        }
    ];
}]);
