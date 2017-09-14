'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.members', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ng-showdown',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.more-less',
    'dmc.recent-news',
    'dmc.socket',
    'ngtimeago',
    'ngCookies',
    'angularUtils.directives.dirPagination',
    'tien.clndr',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.component.treemenu',
    'dmc.component.horizontalmenu',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs',
    'dmc.recent-updates',
    'datamaps'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('member_directory', {
        url: '/member_directory?type?tier?activeProjects?tag?expertiseTags?desiredExpertiseTags',
        templateUrl: 'templates/member-directory/member-directory.html',
        controller: 'DMCMemberDirectoryController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    }).state('members_search', {
        url: '/member_directory/search?type?tier?activeProjects?tag?expertiseTags?desiredExpertiseTags',
        templateUrl: 'templates/member-directory/member-directory.html',
        controller: 'DMCMemberDirectoryController',
        resolve: {
            is_search: function() {
                return true;
            }
        }
    });
    $urlRouterProvider.otherwise('/member_directory');
})
.controller('QuickDocController',
	['$scope', '$rootScope', '$mdDialog', 'doc',
	function ($scope, $rootScope, $mdDialog, doc) {
        $scope.doc = doc;
		$scope.cancel = function(){
            $mdDialog.hide();
		}
}]);
