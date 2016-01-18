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
            accountData: ['AccountModel', '$stateParams',
                function(AccountModel, $stateParams) {
                    return AccountModel.getModel($stateParams.accountId);
                }]
        }
    }).state('account.basics', {
        url: '/basics',
        controller: 'BasicsAccountCtr',
        templateUrl: 'templates/account/basics.html',
        resolve: {
            accountData: ['AccountModel', '$stateParams',
                function(AccountModel, $stateParams) {
                    return AccountModel.getModel($stateParams.accountId);
                }]
        }
    }).state('account.privacy', {
        url: '/privacy',
        controller: 'PrivacyAccountCtr',
        templateUrl: 'templates/account/privacy.html',
        resolve: {
            accountData: ['AccountModel', '$stateParams',
                function(AccountModel, $stateParams) {
                    return AccountModel.getModel($stateParams.accountId);
                }]
        }
    }).state('account.notifications', {
        url: '/notifications',
        controller: 'NotificationsAccountCtr',
        templateUrl: 'templates/account/notifications.html',
        resolve: {
            accountData: ['AccountModel', '$stateParams',
                function(AccountModel, $stateParams) {
                    return AccountModel.getModel($stateParams.accountId);
                }]
        }
    }).state('account.profile', {
        url: '/profile',
        controller: 'ProfileAccountCtr',
        templateUrl: 'templates/account/profile.html',
        resolve: {
            accountData: ['AccountModel', '$stateParams',
                function(AccountModel, $stateParams) {
                    return AccountModel.getModel($stateParams.accountId);
                }]
        }
    }).state('account.servers', {
        url: '/servers',
        controller: 'ServersAccountCtr',
        templateUrl: 'templates/account/servers.html',
        resolve: {
            accountData: ['AccountModel', '$stateParams',
                function(AccountModel, $stateParams) {
                    return AccountModel.getModel($stateParams.accountId);
                }]
        }
    });
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
}]).service('accountUpdate', ['ajax','dataFactory','toastModel', function (ajax,dataFactory,toastModel) {
    this.update = function(data){
        ajax.on(dataFactory.updateAccount(data.id),data,function(result){
            if(result.error){
                toastModel.showToast('error',result.error);
            }else{
                toastModel.showToast('success',"Successfully updated!");
            }
        },function(result){
            toastModel.showToast('error',"Unable update data");
        });
    }
}]);

var pageTitles = {
    basics : "Account Basics",
    privacy : "Privacy",
    notifications : "Notifications",
    profile : "Profile",
    servers : "Servers"
};