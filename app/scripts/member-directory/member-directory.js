'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.members', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'ngtimeago',
    'ngCookies',
    'angularUtils.directives.dirPagination',
    'tien.clndr',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.component.treemenu',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs',
    'datamaps'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('member_directory', {
        url: '/member_directory?type?tier?activeProjects?tag',
        templateUrl: 'templates/member-directory/member-directory.html',
        controller: 'DMCMemberDirectoryController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    }).state('members_search', {
        url: '/member_directory/search?type?tier?activeProjects?tag',
        templateUrl: 'templates/member-directory/member-directory.html',
        controller: 'DMCMemberDirectoryController',
        resolve: {
            is_search: function() {
                return true;
            }
        }
    });
    $urlRouterProvider.otherwise('/member_directory');
});
