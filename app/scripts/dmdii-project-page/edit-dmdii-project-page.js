'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.edit-project', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngtimeago',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'dmc.widgets.stars',
    'dmc.model.question-toast-model',
    'dmc.widgets.review',
    'dmc.widgets.tabs',
    'dmc.component.members-card',
    'dmc.component.contacts-card',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.location',
    'dmc.model.user',
    'dmc.model.toast-model',
    'dmc.model.fileUpload',
    'dmc.model.company',
    'dmc.phone-format',
    'dmc.zip-code-format',
    'dmc.model.account',
    'flow'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('edit-project-page', {
        url: '/:projectId/edit',
        templateUrl: 'templates/dmdii-project-page/edit-dmdii-project-page.html',
        controller: 'DMCEditProjectPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    })
    .state('create-project-page', {
        url: '/',
        templateUrl: 'templates/dmdii-project-page/edit-dmdii-project-page.html',
        controller: 'DMCEditProjectPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    });
    $urlRouterProvider.otherwise('/');
});
