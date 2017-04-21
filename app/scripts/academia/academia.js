'use strict';
angular.module('dmc.academia', [
    'ngMdIcons',
    'ngMaterial',
    'ngSanitize',
    'ui.router',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.ajax',
    'dmc.data'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('academia', {
        template: '<ui-view />'
      }).state('academia.home', {
        url: '/',
        controller: 'academia-controller',
        templateUrl: 'templates/academia/academia.html'
    });
    $urlRouterProvider.otherwise('/');
});
