'use strict';
angular.module('dmc.account', [
    'ngMdIcons',
    'ngAnimate',
    'ngMaterial',
    'ngCookies',
    'ui.router',
    'md.data.table',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.account',
    "dmc.ajax",
    "dmc.location",
    'dmc.model.fileModel',
    'dmc.model.fileUpload',
    'dmc.model.toast-model',
    'dmc.model.question-toast-model',
    'dmc.phone-format',
    'angular-onbeforeunload',
    'dmc.by-parameter',
    'flow'
]).config(function(flowFactoryProvider, $stateProvider, $urlRouterProvider, $httpProvider){

    var resolve = {
        accountData: ['AccountModel', '$stateParams',
            function(AccountModel, $stateParams) {
                return AccountModel.get($stateParams.accountId);
            }]
    };
    $stateProvider.state('account', {
        url: '/:accountId',
        controller: 'AccountIdLocatorCtrl',
        template: '<ui-view />'
    }).state('account.basics', {
        url: '/basics',
        controller: 'BasicsAccountCtr',
        templateUrl: 'templates/account/basics.html',
        resolve: resolve
    }).state('account.privacy', {
        url: '/privacy',
        controller: 'PrivacyAccountCtr',
        templateUrl: 'templates/account/privacy.html',
        resolve: resolve
    }).state('account.notifications', {
        url: '/notifications',
        controller: 'NotificationsAccountCtr',
        templateUrl: 'templates/account/notifications.html',
        resolve: resolve
    }).state('account.profile', {
        url: '/profile',
        controller: 'ProfileAccountCtr',
        templateUrl: 'templates/account/profile.html',
        resolve: resolve
    }).state('account.servers', {
        url: '/servers',
        controller: 'ServersAccountCtr',
        templateUrl: 'templates/account/servers.html',
        resolve: resolve
    }).state('account.dmd-profile', {
        url: '/dmd-profile',
        controller: 'DMDProfileAccountCtr',
        templateUrl: 'templates/account/dmd-profile.html',
        resolve: resolve
    })
    $urlRouterProvider.otherwise('/1');
}).controller('AccountIdLocatorCtrl', [ '$stateParams', '$state', function ($stateParams, $state) {
        var accountId = $stateParams.accountId;
        if (accountId === "" || !angular.isDefined($stateParams.accountId)) {
            location.href = "/";
        }
        var hash = window.location.hash;
        if (hash.lastIndexOf('/') == hash.indexOf('/')) {
            $state.go('account.basics', {accountId: accountId})
        }
}])

var pageTitles = {
    basics : "Account Basics",
    privacy : "Privacy",
    notifications : "Notifications",
    profile : "Profile",
    servers : "Servers"
};