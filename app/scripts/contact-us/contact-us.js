'use strict';
/**
* dmc.dashboard Module
*
* Contact Us
*/
angular.module('dmc.contact-us', [
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
     templateUrl: 'templates/contact-us/index.html',
     controller: 'ContactUsController'
    });
  $urlRouterProvider.otherwise('/');
})