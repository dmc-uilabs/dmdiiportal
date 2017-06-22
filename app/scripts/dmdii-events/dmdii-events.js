'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiEvents', [
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
    'tien.clndr'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('dmdii_events', {
        url: '/dmdii_events?status?rootNumber?callNumber?statusId?focusId?thrustId',
        templateUrl: 'templates/dmdii-events/dmdii-events.html',
        controller: 'DMCDmdiiEventsController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    })
    // .state('dmdii_events_search', {
		// url: '/dmdii_events/search?status?rootNumber?callNumber?statusId?focusId?thrustId',
    //     templateUrl: 'templates/dmdii-projects/dmdii-projects.html',
    //     controller: 'DMCDmdiiProjectsController',
    //     resolve: {
    //         is_search: function() {
    //             return true;
    //         }
    //     }
    // });
    $urlRouterProvider.otherwise('/dmdii_events');
});
