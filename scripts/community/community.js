'use strict';
angular.module('dmc.community', [
    'ngMdIcons',
    'ngAnimate',
    'ngMaterial',
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'md.data.table',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    "dmc.ajax",
    "dmc.data",
    'dmc.compose-discussion',
    'ngtimeago',
    'dmc.community.discussions',
    'dmc.community.dmc-events',
    'dmc.community.dmc-recent-updates',
    'dmc.community.dmc-announcements',
    'dmc.model.toast-model',
    'ngtweet',
    'ngYoutubeEmbed'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('community', {
        template: '<ui-view />'
    }).state('community.home', {
        url: '/home',
        controller: 'HomeCommunityCtr',
        templateUrl: 'templates/community/home.html'
    });
    $urlRouterProvider.otherwise('/home');
});
