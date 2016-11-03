'use strict';
angular.module('dmc.search_v2', [
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
	'dmc.ajax',
	'dmc.data',
    'angularUtils.directives.dirPagination',
    'ngCookies',
    'dmc.component.treemenu',
    'dmc.model.user',
    'dmc.model.project',
    'dmc.model.member',
    'dmc.community',
    'dmc.widgets.tabs',
    'dmc.add_project.directive',
	'dmc.model.toast-model'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
	$stateProvider
        .state('search-v2', {
    		url: '/:type',
    		controller: 'SearchV2Controller',
    		templateUrl: 'templates/search-v2/search-v2.html'
	    });
	// $urlRouterProvider.otherwise('/all');
});
