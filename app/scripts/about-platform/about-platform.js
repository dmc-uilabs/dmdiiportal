'use strict';
angular.module('dmc.about-platform', [
    'ngMdIcons',
    // 'ngAnimate',
    'ngMaterial',
    'ngSanitize',
    'ui.router',
    // 'md.data.table',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    // 'dmc.model.toast-model',
    "dmc.ajax",
    "dmc.data"
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('about-platform', {
        template: '<ui-view />'
      }).state('about-platform.home', {
        url: '/',
        controller: 'about-platform-controller',
        templateUrl: 'templates/about-platform/about-platform.html'
    });
    $urlRouterProvider.otherwise('/');
});
