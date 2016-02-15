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
            img : "home-dashboard-icon.png",
            show: true,
            more : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        },
        {
            name : "Marketplace",
            text : "Find Solutions",
            href : "marketplace.php",
            img : "home-market-icon.png",
            show: true,
            more : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        },
        {
            name : "Community",
            text : "Find People",
            href : "community.php",
            img : "home-community-icon.png",
            show: true,            
            more : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        }
    ];
    $scope.more = function(index){
        $scope.pages[index].show = false;
    }
    $scope.cancel = function(index){
        $scope.pages[index].show = true;
    }
}]);
