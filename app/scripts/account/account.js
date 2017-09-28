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
    'dmc.ajax',
    'dmc.location',
    'dmc.model.fileModel',
    'dmc.model.fileUpload',
    'dmc.model.toast-model',
    'dmc.model.question-toast-model',
    'dmc.phone-format',
    'dmc.by-parameter',
    'dmc.model.profile',
    'dmc.widgets.rich-text',
    'dmc.widgets.documents'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){

    var resolve = {
      accountData: ['AccountModel', '$stateParams',
          function(AccountModel, $stateParams) {
              return AccountModel.get($stateParams.accountId);
          }]
    };
    var resolve_profile = {
        accountData: ['AccountModel', '$stateParams',
            function(AccountModel, $stateParams) {
                return AccountModel.get($stateParams.accountId);
            }],
        profileData: ['profileModel', '$stateParams',
            function (profileModel, $stateParams) {
                return profileModel.get_profile($stateParams.accountId);
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
    }).state('account.profile', {
        url: '/profile',
        controller: 'ProfileAccountCtr',
        templateUrl: 'templates/account/profile.html',
        resolve: resolve_profile
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
    }).state('account.servers', {
        url: '/servers',
        controller: 'ServersAccountCtr',
        templateUrl: 'templates/account/servers.html',
        resolve: resolve
    })
    $urlRouterProvider.otherwise('/1');
}).service('profileModel', ['ajax', '$q','$http','dataFactory', '$stateParams', 'toastModel', '$rootScope','DMCUserModel',
                        function (ajax,$q,$http, dataFactory, $stateParams, toastModel, $rootScope, DMCUserModel) {
    this.get_profile = function(id){
        var promises = {
            'profile' : $http.get(dataFactory.userAccount(id).get)
        };

        var extractData = function(response){
            return response.data ? response.data : response;
        };

        return $q.all(promises).then(function(responses) {
            var profile = extractData(responses.profile);
            DMCUserModel.getUserData().then(function(res){
                ajax.get(dataFactory.getAccount(res.accountId),{},function(data){
                    profile.account = extractData(data);
                    profile.isPublicContacts = false;
                    for(var key in profile.account.privacy.public){
                        if(profile.account.privacy.public[key].enable == true){
                            profile.isPublicContacts = true;
                            break;
                        }
                    }
                });
            });
            return profile;
        },function(response){
            toastModel.showToast('error', 'Error.' + response.statusText);
        });

    };

    this.edit_profile = function(id, params, callback){
        ajax.get(dataFactory.userAccount(id).get,
            {},
            function(response){
                var profile = response.data;
                profile['aboutMe'] = params['aboutMe'];
                profile['displayName'] = params['displayName'];
                profile['title'] = params['title'];
                profile['skills'] = params['skills'];
                profile['address'] = params['address'];

                return ajax.update(dataFactory.updateUser(),
                    profile,
                    function(response){
                        callback(response.data)
                    },
                    function(response){
                        toastModel.showToast('error', 'Error.' + response.statusText);
                    }
                )
            },
            function(response){
                toastModel.showToast('error', 'Error.' + response.statusText);
            }
        )
    }

    this.getProfileHistory = function(params, callback){
        return ajax.get(dataFactory.profiles($stateParams.profileId).history,
            params,
            function(response){
                callback(response.data)
            }
        )
    };
}]).controller('AccountIdLocatorCtrl', [ '$stateParams', '$state', function ($stateParams, $state) {
        var accountId = $stateParams.accountId;
        if (accountId === '' || !angular.isDefined($stateParams.accountId)) {
            location.href = '/';
        }
        var hash = window.location.hash;
        if (hash.lastIndexOf('/') == hash.indexOf('/')) {
            $state.go('account.basics', {accountId: accountId})
        }
}])

var pageTitles = {
    basics : 'Account Basics',
    profile: 'Profile',
    privacy : 'Privacy',
    notifications : 'Notifications',
    servers : 'Servers'
};
