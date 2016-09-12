'use strict';

var currentAccountId = 1;

angular.module('dmc.addDmdiiContent', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngtimeago',
    'ui.router',
    'md.data.table',
    'angular-medium-editor',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'dmc.model.question-toast-model',
    'dmc.widgets.tabs',
	'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.location',
    'dmc.model.user',
    'dmc.model.toast-model',
    'dmc.model.fileUpload',
    'dmc.zip-code-format',
    'flow'
])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
        $stateProvider.state('add-dmdii-content', {
            url: '/addContent',
            templateUrl: 'templates/add-dmdii-content/add-dmdii-content.html',
            controller: 'addDmdiiContentController'
        }).state('add-dmdii-content.quicklinks', {
            url: '/quicklinks'
        }).state('add-dmdii-content.projectEvents', {
            url: '/projectEvents'
        }).state('add-dmdii-content.projectNews', {
            url: '/projectNews'
        }).state('add-dmdii-content.memberEvents', {
            url: '/memberEvents'
        }).state('add-dmdii-content.memberNews', {
            url: '/memberNews'
        }).state('add-dmdii-content.projectsOverview', {
            url: '/projectsOverview'
		}).state('add-dmdii-content.projectStatus', {
			url: '/projectStatus'
		});

        $urlRouterProvider.otherwise('/addContent/quicklinks');

    })
