'use strict';
angular.module('dmc.view-all', [
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
	"dmc.ajax",
	"dmc.data",
    'dmc.model.project',
	'dmc.model.toast-model'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    var resolve = {
        projectData: ['DMCProjectModel', '$stateParams',
            function(DMCProjectModel, $stateParams) {
                return DMCProjectModel.getModel($stateParams.projectId);
            }]
    };
	$stateProvider
        .state('tasks', {
    		url: '/tasks/:projectId?text?type',
    		controller: 'ViewAllTasksController',
    		templateUrl: 'templates/all/all-tasks.html',
            resolve : resolve
	    }).state('services', {
            url: '/services/:projectId?text?type',
            controller: 'ViewAllServicesController',
            templateUrl: 'templates/all/all-services.html',
            resolve : resolve
        }).state('discussions', {
            url: '/discussions/:projectId?text?type',
            controller: 'ViewAllDiscussionsController',
            templateUrl: 'templates/all/all-discussions.html',
            resolve : resolve
        }).state('run-services', {
            url: '/run-services',
            controller: 'ViewAllRunServicesController',
            templateUrl: 'templates/all/run-services.html'
        }).state('user-services', {
            url: '/services?text?type',
            controller: 'ViewAllUserServicesController',
            templateUrl: 'templates/all/user-all-services.html'
        }).state('user-tasks', {
            url: '/tasks?text?type',
            controller: 'ViewAllUserTasksController',
            templateUrl: 'templates/all/user-all-tasks.html'
        });
	$urlRouterProvider.otherwise('/services/1');
});