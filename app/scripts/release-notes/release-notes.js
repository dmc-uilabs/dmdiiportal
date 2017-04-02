'use strict';
angular.module('dmc.release-notes', [
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
    $stateProvider.state('release-notes', {
        template: '<ui-view />'
      }).state('release-notes.home', {
        url: '/',
        controller: 'release-notes-controller',
        templateUrl: 'templates/release-notes/release-notes.html'
    });
    $urlRouterProvider.otherwise('/');
});
