'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.partnerprojects', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'ngtimeago',
    'ngCookies',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.component.treemenu',
    'dmc.compare',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs',
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('partner_projects', {
        url: '/partner_projects?status',
        templateUrl: 'templates/partner-projects/partner-projects.html',
        controller: 'DMCPartnerProjectsController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    }).state('partner_projects_search', {
		url: '/partner_projects/search?status',
        templateUrl: 'templates/partner-projects/partner-projects.html',
        controller: 'DMCPartnerProjectsController',
        resolve: {
            is_search: function() {
                return true;
            }
        }
    });
    $urlRouterProvider.otherwise('/partner_projects');
});
