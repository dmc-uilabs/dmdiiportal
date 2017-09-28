'use strict';
angular.module('dmc.add_project', [
    'dmc.configs.ngmaterial',
    'dmc.rfpInvite',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('add_project', {
        url: '',
        abstract: true
    });
    $urlRouterProvider.otherwise('/');
});