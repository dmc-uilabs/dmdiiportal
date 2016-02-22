'use strict';
angular.module('dmc.search', [
	'ngMdIcons',
	'ngAnimate',
	'ngMaterial',
	'ngCookies',
	'ngSanitize',
	'ui.router',
	'md.data.table',
	'dmc.configs.ngmaterial',
	'dmc.common.header',
	'dmc.common.footer',
    'dmc.model.previous-page',
    'dmc.common.notifications',
	"dmc.ajax",
	"dmc.data",
    'dmc.component.treemenu',
    'dmc.model.user',
    'dmc.model.project',
    'dmc.model.member',
    'dmc.community',
    'dmc.add_project.directive',
	'dmc.model.toast-model'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
	$stateProvider
        .state('search', {
    		url: '/:type?subtype?text?limit?sort?page',
    		controller: 'SearchController',
    		templateUrl: 'templates/search/search.html'
	    });
	$urlRouterProvider.otherwise('/all');
});