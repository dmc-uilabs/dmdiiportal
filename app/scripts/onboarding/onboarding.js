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
            .state('home', {
                url: '/',
                templateUrl: 'templates/onboarding/home.html',
                controller: 'homeController'
                
            });
        $urlRouterProvider.otherwise('/1');
    })
    .service('onboardingModel', ['ajax', 'dataFactory', '$stateParams', 'toastModel',
                            function (ajax, dataFactory, $stateParams, toastModel) {
       
    }])