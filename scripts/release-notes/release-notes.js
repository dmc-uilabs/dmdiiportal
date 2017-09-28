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
    "dmc.data",
    'RecursionHelper'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('release-notes', {
        template: '<ui-view />'
      }).state('release-notes.home', {
        url: '/',
        controller: 'release-notes-controller',
        templateUrl: 'templates/release-notes/release-notes.html'
    });
    $urlRouterProvider.otherwise('/');
}).directive('releaseTree', function (RecursionHelper) {
    return {
        restrict: 'E',
        scope:{
          notes: '='
        },
        templateUrl: 'templates/release-notes/release-tree.html',
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
            });
        },
        controller: function ($scope,$mdDialog,$rootScope,ajax,dataFactory,DMCUserModel) {

        }
      }
    }
  );
