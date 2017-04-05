'use strict';
angular.module('dmc.security', [
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
    $stateProvider.state('security', {
        template: '<ui-view />'
      }).state('security.home', {
        url: '/',
        controller: 'security-controller',
        templateUrl: 'templates/security/security.html'
    });
    $urlRouterProvider.otherwise('/');
});
