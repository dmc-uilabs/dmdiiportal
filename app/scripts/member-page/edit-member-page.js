'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.member', [
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
    $stateProvider.state('edit_member_page', {
        url: '/:memberId',
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
