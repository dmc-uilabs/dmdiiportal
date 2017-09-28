'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiProjects', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngSanitize',
    'ng-showdown',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'ngtimeago',
    'ngCookies',
    'angularUtils.directives.dirPagination',
    'angular-horizontal-timeline',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.component.treemenu',
    'dmc.component.horizontalmenu',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs',
    'dmc.recent-news',
    'dmc.recent-updates'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('dmdii_projects', {
        url: '/dmdii_projects?status?rootNumber?callNumber?statusId?focusId?thrustId',
        templateUrl: 'templates/dmdii-projects/dmdii-projects.html',
        controller: 'DMCDmdiiProjectsController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    }).state('dmdii_projects_search', {
		url: '/dmdii_projects/search?status?rootNumber?callNumber?statusId?focusId?thrustId',
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
