'use strict';
angular.module('dmc.create_project', [
    'dmc.configs.ngmaterial',
    'dmc.rfpInvite',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'dmc.common.header',
    'dmc.common.footer'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('create_project', {
        url: '',
        abstract: true
    });
    $urlRouterProvider.otherwise('/');
}).controller('DMCCreateProjectController', function ($scope) {

});