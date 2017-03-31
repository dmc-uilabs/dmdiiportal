'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiProj', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'ng-showdown',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'ngtimeago',
    'ngCookies',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer',
	'dmc.component.productscard',
	'dmc.component.carousel',
  'dmc.component.documentinfo',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('project_page', {
        url: '/:projectId',
        templateUrl: 'templates/dmdii-project-page/new-dmdii-project-page.html',
        controller: 'DMCDmdiiProjectPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    });
    $urlRouterProvider.otherwise('/project_page');
}).directive('tabContributors', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/dmdii-project-page/tab-contributors.html',
        scope:{
        },
        controller: function ($scope,$mdDialog,$rootScope,ajax,dataFactory,DMCUserModel) {

        }
      }
    }
  ).directive('tabSchedule', function () {
      return {
          restrict: 'E',
          templateUrl: 'templates/dmdii-project-page/tab-schedule.html',
          scope:{
          },
          controller: function ($scope,$mdDialog,$rootScope,ajax,dataFactory,DMCUserModel) {

          }
        }
      }
  ).directive('tabUpdates', function () {
      return {
          restrict: 'E',
          templateUrl: 'templates/dmdii-project-page/tab-updates.html',
          scope:{
          },
          controller: function ($scope,$mdDialog,$rootScope,ajax,dataFactory,DMCUserModel) {

          }
        }
      }
  ).directive('tabDocuments', function () {
      return {
          restrict: 'E',
          templateUrl: 'templates/dmdii-project-page/tab-documents.html',
          scope:{
          },
          controller: function ($scope,$mdDialog,$rootScope,ajax,dataFactory,DMCUserModel) {

          }
        }
      }
  )
