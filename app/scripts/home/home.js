'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/
angular.module('dmc.home', ['dmc.configs.ngmaterial', 'ngMdIcons', 'ui.router', 'md.data.table', 'dmc.common.header', 'dmc.common.footer', 'dmc.model.user'])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
     url: '/',
     templateUrl: 'templates/index/index.html',
     controller: 'HomeCtr',
    });
  $urlRouterProvider.otherwise('/');
}).controller('HomeCtr',['$scope', function($scope){
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
            href : "community.php",
            img : "home-community-icon.png"
        }
    ];
}]);
