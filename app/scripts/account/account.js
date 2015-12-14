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
    'flow'
]).config(function(flowFactoryProvider, $stateProvider, $urlRouterProvider, $httpProvider){

    flowFactoryProvider.on('catchAll', function (event) {
        //console.log('catchAll', arguments);
    });

    $stateProvider.state('account', {
        url: '/:accountId',
        controller: 'AccountIdLocatorCtrl',
        template: '<ui-view />',
        resolve: {
            projectData: ['AccountModel', '$stateParams',
                function(AccountModel, $stateParams) {
                    return AccountModel.getModel($stateParams.accountId);
                }]
        }
    }).state('account.basics', {
        url: '/basics',
        controller: 'BasicsAccountCtr',
        templateUrl: 'templates/account/basics.html'
    }).state('account.privacy', {
        url: '/privacy',
        controller: 'PrivacyAccountCtr',
        templateUrl: 'templates/account/privacy.html'
    }).state('account.notifications', {
        url: '/notifications',
        controller: 'NotificationsAccountCtr',
        templateUrl: 'templates/account/notifications.html'
    }).state('account.profile', {
        url: '/profile',
        controller: 'ProfileAccountCtr',
        templateUrl: 'templates/account/profile.html'
    }).state('account.services', {
        url: '/services',
        controller: 'ServicesAccountCtr',
        templateUrl: 'templates/account/services.html'
    });
    $urlRouterProvider.otherwise('/1');
}).controller('AccountIdLocatorCtrl', [ '$stateParams', '$state', function ($stateParams, $state) {
        var accountId = $stateParams.accountId;
        console.log(accountId);
        if (accountId === "" || !angular.isDefined($stateParams.accountId)) {
            location.href = "/";
        }
        var hash = window.location.hash;
        if (hash.lastIndexOf('/') == hash.indexOf('/')) {
            $state.go('account.basics', {accountId: accountId})
        }
}]);

var pageTitles = {
    basics : "Account Basics",
    privacy : "Privacy",
    notifications : "Notifications",
    profile : "Profile",
    services : "Services"
};