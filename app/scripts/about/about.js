'use strict';

angular.module('dmc.about', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.user'
])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
     url: '/',
     templateUrl: 'templates/about/about.html',
     controller: 'AboutController'
    });
  $urlRouterProvider.otherwise('/');
})
