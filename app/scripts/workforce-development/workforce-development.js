'use strict';
angular.module('dmc.workforce-development', [
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
    $stateProvider.state('workforce-development', {
        template: '<ui-view />'
      }).state('workforce-development.home', {
        url: '/',
        controller: 'workforce-development-controller',
        templateUrl: 'templates/workforce-development/workforce-development.html'
    });
    $urlRouterProvider.otherwise('/');
});
