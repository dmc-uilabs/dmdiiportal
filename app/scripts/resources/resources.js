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
        url: '/home',
        controller: 'ResourcesCtr',
        templateUrl: 'templates/resources/resources.html'
    });
    $urlRouterProvider.otherwise('/home');
});
