'use strict';

var currentAccountId = 1;

angular.module('dmc.uploadApplication', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngtimeago',
    'ng-showdown',
    'ui.router',
    'md.data.table',
    'angular-medium-editor',
    'dmc.ajax',
    'dmc.data',
    'ui.select',
    'dmc.socket',
	'dmc.widgets.documents',
    'dmc.widgets.rich-text',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.user',
    'dmc.model.toast-model',
    'dmc.model.fileUpload',
    'dmc.phone-format'
])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
        $stateProvider.state('upload-application', {
            url: '/',
            templateUrl: 'templates/upload-application/upload-application.html',
            controller: 'uploadApplicationController'
        });

        $urlRouterProvider.otherwise('/');
    });
