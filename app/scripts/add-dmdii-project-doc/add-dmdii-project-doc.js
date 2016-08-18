'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.add-project-doc', [
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
	'dmc.widgets.documents',
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
    $stateProvider.state('add-doc', {
        url: '/:projectId',
        templateUrl: 'templates/add-dmdii-project-doc/add-dmdii-project-doc.html',
        controller: 'DMCAddProjectDocController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    });

    $urlRouterProvider.otherwise('/');
});
