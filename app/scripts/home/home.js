'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/
angular.module('dmc.home', ['dmc.configs.ngmaterial', 'ngMdIcons', 'ui.router', 'md.data.table', 'dmc.common.header', 'dmc.common.footer', 'dmc.model.user', 'dmc.home.dmc-recent-updates', 'ngtweet', 'ngYoutubeEmbed'])
.run(['$rootScope', function($rootScope){
      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (error == 'User not created') {
                event.preventDefault();
                window.location = '/onboarding.php#/home';
            }
      });
}])
.config(function($stateProvider, $urlRouterProvider){
  var resolver = { userData : ['DMCUserModel', function(DMCUserModel) {
            return DMCUserModel.resolver();
        }
    ]};
  $stateProvider
    .state('home', {
     url: '/',
      templateUrl: 'templates/index/index.html',
     resolve: resolver,
      controller: 'HomeCtr'
    });
  $urlRouterProvider.otherwise('/');
}).controller('HomeCtr',['$scope', 'userData', function($scope, userData){
    $scope.pages = [
        // {
        //     name : "Dashboard",
        //     text : "Design Solutions",
        //     href : "dashboard.php",
        //     img : "home-dashboard-icon.png",
        //     show: true,
        //     more : "A quick overview of everything on the site related to you and your interests, from tasks and projects to discussions and services."
        // },
        {
            name : "Marketplace",
            text : "Find Solutions",
            href : "marketplace.php",
            img : "home-market-icon.png",
            show: true,
            more : "Search for services and solutions for your projects, access company storefronts and market your own offerings on the site"
        },
        {
            name : "Community",
            text : "Find People",
            href : "community.php",
            img : "home-community-icon.png",
            show: true,
            more : "View profiles of companies and members, ask questions and discuss things with other members, and manage your own personal or company profile."
        }
    ];
    $scope.more = function(index){
        $scope.pages[index].show = false;
    }
    $scope.cancel = function(index){
        $scope.pages[index].show = true;
    }
}]);
