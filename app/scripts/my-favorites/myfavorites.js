'use strict';
angular.module('dmc.myfavorites', [
	'ngMdIcons',
	'ngMaterial',
	'ngCookies',
	'ui.router',
	'dmc.configs.ngmaterial',
	'dmc.common.header',
	'dmc.common.footer',
	"dmc.ajax",
    "dmc.widgets.content"
])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider){
        $stateProvider
            .state('myFavorites', {
                url: '',
                abstract: true,
                controller: 'myfavoritesCtrl',
                template: '<ui-view></ui-view>',
                // templateUrl: 'templates/favorites/myfavorites.html'
            })
           .state('myFavorites.my', {
               url: '/my',
               templateUrl: 'templates/myfavorites/myfavorites.html',
               controller: 'myfavoritesCtrl'
           });
        $urlRouterProvider.otherwise('/my');
    });
