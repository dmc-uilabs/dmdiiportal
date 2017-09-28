'use strict';
angular.module('dmc.unauthorized', [
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
	'dmc.model.toast-model'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
	$stateProvider
        .state('company', {
    		url: '/company',
    		controller: 'CompanyController',
    		templateUrl: 'templates/unauthorized/company.html'
	    }).state('dmd-member', {
            url: '/dmd-member',
            controller: 'DMDMemberController',
            templateUrl: 'templates/unauthorized/DMDII-member.html'
        });
	$urlRouterProvider.otherwise('/');
});