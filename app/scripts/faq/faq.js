'use strict';
angular.module('dmc.faq', [
    'ngMdIcons',
    'ngAnimate',
    'ngMaterial',
    'ngSanitize',
    'ui.router',
    'md.data.table',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.toast-model',
    "dmc.ajax",
    "dmc.data"
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('faq', {
        template: '<ui-view />'
    }).state('faq.general', {
        url: '/general/:categoryId?:text',
        controller: 'GeneralFAQCtr',
        templateUrl: 'templates/faq/general.html'
    }).state('faq.article', {
        url: '/article/:categoryId/:articleId?:text',
        controller: 'GeneralFAQCtr',
        templateUrl: 'templates/faq/general.html'
    });
    $urlRouterProvider.otherwise('/general/all');
});