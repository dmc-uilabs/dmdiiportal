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
    'ng-showdown',
    'ui.router',
    'md.data.table',
    'angular-medium-editor',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'dmc.widgets.stars',
    'dmc.widgets.rich-text',
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
    'dmc.model.account'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('edit-project-page', {
        url: '/:projectId/edit',
        templateUrl: 'templates/edit-dmdii-project-page/edit-dmdii-project-page.html',
        controller: 'DMCEditProjectPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    })
    .state('create-event-page', {
        url: '/event',
        templateUrl: 'templates/edit-dmdii-project-page/edit-dmdii-event-page.html',
        controller: 'DMCEditEventPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    })
    .state('edit-event-page', {
        url: '/event/:eventId/edit',
        templateUrl: 'templates/edit-dmdii-project-page/edit-dmdii-event-page.html',
        controller: 'DMCEditEventPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    })
    .state('create-project-page', {
      url: '/',
      templateUrl: 'templates/edit-dmdii-project-page/edit-dmdii-project-page.html',
      controller: 'DMCEditProjectPageController',
      resolve: {
        is_search: function() {
          return false;
        }
      }
    });
    $urlRouterProvider.otherwise('/');
});
