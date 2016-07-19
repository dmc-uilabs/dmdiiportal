'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiProj', [
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
	'dmc.component.productscard',
	'dmc.component.carousel',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs',
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('project_page', {
        url: '/:projectId',
        templateUrl: 'templates/dmdii-project-page/dmdii-project-page.html',
        controller: 'DMCDmdiiProjectPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    });
    $urlRouterProvider.otherwise('/project_page');
});
