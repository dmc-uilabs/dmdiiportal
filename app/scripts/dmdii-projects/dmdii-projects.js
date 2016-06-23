'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiProjects', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'ngtimeago',
    'ngCookies',
    'angular-horizontal-timeline',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.component.treemenu',
    'dmc.compare',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs',
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('dmdii_projects', {
        url: '/dmdii_projects?status?rootNumber?callNumber?statusId?focusId',
        templateUrl: 'templates/dmdii-projects/dmdii-projects.html',
        controller: 'DMCDmdiiProjectsController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    }).state('dmdii_projects_search', {
		url: '/dmdii_projects/search?status?rootNumber?callNumber?statusId?focusId',
        templateUrl: 'templates/dmdii-projects/dmdii-projects.html',
        controller: 'DMCDmdiiProjectsController',
        resolve: {
            is_search: function() {
                return true;
            }
        }
    });
    $urlRouterProvider.otherwise('/dmdii_projects');
});
