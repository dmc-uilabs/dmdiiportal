'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.proj', [
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
    'dmc.compare',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs',
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('project_page', {
        url: '/:projectId',
        templateUrl: 'templates/partner-project-page/partner-project-page.html',
        controller: 'DMCProjectPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    });
    $urlRouterProvider.otherwise('/project_page');
});
