'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.edit-member', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngtimeago',
    'ng-showdown',
    'ui.router',
    'md.data.table',
    'angular-medium-editor',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'dmc.model.question-toast-model',
    'dmc.widgets.tabs',
    'dmc.component.contacts-card',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.location',
    'dmc.model.user',
    'dmc.model.toast-model',
    'dmc.model.fileUpload',
    'dmc.phone-format',
    'dmc.zip-code-format',
    'flow'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('edit-member-page', {
        url: '/:memberId/edit',
        templateUrl: 'templates/edit-member-page/edit-member-page.html',
        controller: 'DMCEditMemberPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    })
    .state('create-member-page', {
        url: '/',
        templateUrl: 'templates/edit-member-page/edit-member-page.html',
        controller: 'DMCEditMemberPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    });
    $urlRouterProvider.otherwise('/');
});
