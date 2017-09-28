'use strict';
angular.module('dmc.all-favorites', [
	'ngMdIcons',
	'ngAnimate',
	'ngMaterial',
	'ngCookies',
	'ngSanitize',
	'ui.sortable',
	'ui.router',
	'md.data.table',
	'dmc.configs.ngmaterial',
	'dmc.common.header',
	'dmc.common.footer',
	"dmc.ajax",
	"dmc.data",
	'dmc.component.treemenu',
	'dmc.component.productscard',
	'dmc.component.productcard',
	'dmc.component.carousel',
	'dmc.compare',
	'dmc.model.toast-model',
	'dmc.component.products-filter',
  'dmc.model.previous-page',
	'dmc.model.services',
	'ng-autofocus'
])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider){
        $stateProvider
            .state('allFavorites', {
                url: '/home?product?type?text',
                controller: 'AllFavoritesCtrl',
                templateUrl: 'templates/favorites/favorites.html'
            })
            .state('allFavoritesSearch', {
                url: '/search?product?type?authors?ratings?favorites?dates?text',
                controller: 'AllFavoritesCtrl',
                templateUrl: 'templates/favorites/favorites.html'
            });
        $urlRouterProvider.otherwise('/home?product=services');
    });
