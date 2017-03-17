'use strict';
angular.module('dmc.application-creation', [
    'ngMdIcons',
    'ngMaterial',
    'ngSanitize',
    'ui.router',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    "dmc.ajax",
    "dmc.data"
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('application-creation', {
        template: '<ui-view />'
      }).state('application-creation.home', {
        url: '/',
        controller: 'application-creation-controller',
        templateUrl: 'templates/application-creation/application-creation.html'
    });
    $urlRouterProvider.otherwise('/');
});
