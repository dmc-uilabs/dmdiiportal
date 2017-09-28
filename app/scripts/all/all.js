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
    'dmc.select-project',
	'dmc.common.footer',
    'dmc.model.previous-page',
    'dmc.widgets.tasks',
    'dmc.model.question-toast-model',
	"dmc.ajax",
	"dmc.data",
    'dmc.model.project',
    'dmc.model.user',
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
        }).state('user-discussions', {
            url: '/discussions?text?type',
            controller: 'ViewAllUserDiscussionsController',
            templateUrl: 'templates/all/user-all-discussions.html'
        }).state('invitations', {
            url: '/invitations',
            controller: 'ViewAllInvitationsController',
            templateUrl: 'templates/all/all-invitations.html'
        }).state('announcements', {
            url: '/announcements?text?type',
            controller: 'ViewAllAnnouncementsController',
            templateUrl: 'templates/all/all-announcements.html'
        }).state('history-profile', {
            url: '/history/profile/:profileId/:type',
            controller: 'ViewAllHistoryProfileController',
            templateUrl: 'templates/all/all-history.html'
        }).state('history-company', {
            url: '/history/company/:companyId/:type',
            controller: 'ViewAllHistoryCompanyController',
            templateUrl: 'templates/all/all-history.html'
        }).state('history-service', {
            url: '/history/service/:serviceId/:type',
            controller: 'ViewAllHistoryServiceController',
            templateUrl: 'templates/all/all-history.html'
        });
	$urlRouterProvider.otherwise('/services/1');
});
