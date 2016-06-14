'use strict';
angular.module('dmc.resources', [
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
    $stateProvider.state('resources', {
        template: '<ui-view />'
    }).state('resources.home', {
        url: '',
        controller: 'ResourcesCtr',
        templateUrl: 'templates/resources/resources.html'
    }).state('resources.about', {
        url: '/about',
        controller: 'ResourcesCtr',
        templateUrl: 'templates/resources/pages/about.html'
    }).state('resources.fellowships', {
        url: '/fellowships',
        controller: 'ResourcesCtr',
        templateUrl: 'templates/resources/pages/fellowship.html'
    }).state('resources.workforce', {
        url: '/workforce',
        controller: 'ResourcesCtr',
        templateUrl: 'templates/resources/pages/workforce.html'
    }).state('resources.projects', {
        url: '/projects',
        controller: 'ResourcesCtr',
        templateUrl: 'templates/resources/pages/projects.html'
    }).state('resources.shop-floor', {
        url: '/shop-floor',
        controller: 'ResourcesCtr',
        templateUrl: 'templates/resources/pages/shop-floor.html'
    });
    $urlRouterProvider.otherwise('/');
});
