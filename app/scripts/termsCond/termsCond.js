'use strict';
angular.module('dmc.termsCond', [
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
    'dmc.ajax',
    'dmc.data'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('termsCond', {
        template: '<ui-view />'
    }).state('termsCond.home', {
        url: '/home',
        controller: 'termsCondCtr',
        templateUrl: 'templates/termsCond/termsCond.html'
    });
    $urlRouterProvider.otherwise('/home');
});
