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
    $stateProvider.state('edit-member-page', {
        url: '/:memberId/edit',
        templateUrl: 'templates/member-page/edit-member-page.html',
        controller: 'DMCEditMemberPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    });
    $urlRouterProvider.otherwise('/edit_member_page');
});
