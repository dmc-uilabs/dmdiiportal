'use strict';

angular.module('dmc.onboarding', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngtimeago',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'dmc.widgets.stars',
    'dmc.widgets.review',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.location',
    'dmc.model.toast-model',
    'dmc.model.profile',
    'flow'
])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('onboarding',{
                url: '',
                abstract: true,
                template: "<ui-view></ui-view>",
                controller: 'onboardingController'
            })
            .state('onboarding.home', {
                url: '/home',
                templateUrl: 'templates/onboarding/home.html',
                controller: 'homeController'
            })
            .state('onboarding.account', {
                url: '/account',
                templateUrl: 'templates/onboarding/account/account.html',
                controller: 'AccountController'
            })
                .state('onboarding.account.public', {
                    url: '/public-information',
                    templateUrl: 'templates/onboarding/account/public.html'
                })
                .state('onboarding.account.private', {
                    url: '/private-information',
                    templateUrl: 'templates/onboarding/account/private.html'
                })
                .state('onboarding.account.web', {
                    url: '/web-notifications',
                    templateUrl: 'templates/onboarding/account/web-notifications.html'
                })
                .state('onboarding.account.email', {
                    url: '/email-notifications',
                    templateUrl: 'templates/onboarding/account/email-notifications.html'
                })
                .state('onboarding.account.servers', {
                    url: '/servers',
                    templateUrl: 'templates/onboarding/account/servers.html'
                })

            .state('company', {
                url: '/company',
                templateUrl: 'templates/onboarding/company.html',
                controller: 'CompanyController'
            })
            .state('onboarding.profile', {
                url: '/profile',
                templateUrl: 'templates/onboarding/profile/profile.html',
                controller: 'ProfileController'
            })
                .state('onboarding.profile.basic', {
                    url: '/basic-informations',
                    templateUrl: "templates/onboarding/profile/basic.html"
                })
                .state('onboarding.profile.image', {
                    url: '/profile-image',
                    templateUrl: "templates/onboarding/profile/image.html"
                }) 
                .state('onboarding.profile.skill', {
                    url: '/skills',
                    templateUrl: "templates/onboarding/profile/skill.html"
                }) 

            .state('onboarding.storefront', {
                url: '/storefront',
                templateUrl: 'templates/onboarding/storefront/storefront.html',
                controller: 'StorefrontController'
            })
                .state('onboarding.storefront.cover', {
                    url: '/cover-image',
                    templateUrl: "templates/onboarding/storefront/cover.html"
                })
                .state('onboarding.storefront.description', {
                    url: '/description',
                    templateUrl: "templates/onboarding/storefront/description.html"
                }) 
                .state('onboarding.storefront.logo', {
                    url: '/logo',
                    templateUrl: "templates/onboarding/storefront/logo.html"
                });
        $urlRouterProvider.otherwise('/home');
    })
    .service('onboardingModel', ['ajax', 'dataFactory', '$stateParams', 'toastModel',
                            function (ajax, dataFactory, $stateParams, toastModel) {

    }])