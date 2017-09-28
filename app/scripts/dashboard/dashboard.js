'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/
angular.module('dmc.dashboard', [
        'dmc.mobile',
        'dmc.configs.ngmaterial',
        'dmc.widgets.tasks',
        'dmc.widgets.services',
        'dmc.widgets.projects',
        'dmc.widgets.discussions',
        'dmc.widgets.onboarding',
        'ngMdIcons',
        'ngtimeago',
        'dmc.model.previous-page',
        'ui.router',
        'md.data.table',
        'dmc.common.header',
        'dmc.common.footer'
])
    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('dashboard', {
                url: '/',
                templateUrl: 'templates/dashboard/dashboard.html',
                controller: 'DashboardController'
            });
        $urlRouterProvider.otherwise('/');
})
