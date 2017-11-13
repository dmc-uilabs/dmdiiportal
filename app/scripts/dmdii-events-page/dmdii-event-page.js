'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiEvnt', [
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
    'dmc.widgets.tabs',
    'dmc.model.toast-model',
    'dmc.model.question-toast-model'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('event_page', {
        url: '/:eventId',
        templateUrl: 'templates/dmdii-event-page/dmdii-event-page.html',
        controller: 'DMCDmdiiEventPageController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    })
    .state('view_event', {
      url: '/event/:eventId',
      templateUrl: 'templates/dmdii-events/view-event.html',
      controller: 'DMCDmdiiEventPageController',
      resolve: {
          is_search: function() {
              return false;
          }
      }
    });
    $urlRouterProvider.otherwise('/event_page');
}).directive('tabContributors', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/dmdii-event-page/tab-contributors.html',
        scope:{
          project: '=',
          userData: '='
        },
        controller: function ($scope,$mdDialog,$rootScope,ajax,dataFactory,DMCUserModel) {

        }
      }
    }
  ).directive('tabSchedule', function () {
      return {
          restrict: 'E',
          templateUrl: 'templates/dmdii-event-page/tab-schedule.html',
          scope:{
            eventSchedule: '=',
            userData: '='
          },
          controller: function ($scope,$mdDialog,$rootScope,ajax,dataFactory,DMCUserModel) {

            $scope.deleteDocument = function(id, type, index) {
                ajax.delete(dataFactory.deleteDMDIIDocument(id), {}, function() {
                    if (type != 'doc') {
                    } else {
                        $scope.documents.splice(index, 1);
                    }
                });
            };

          }
        }
      }
  ).directive('tabUpdates', function () {
      return {
          restrict: 'E',
          templateUrl: 'templates/dmdii-event-page/tab-updates.html',
          scope:{
            updates: '=',
            userData: '='
          },
          controller: function ($scope,$mdDialog,$rootScope,ajax,dataFactory,DMCUserModel) {

            $scope.deleteUpdate = function(index, id) {
                ajax.delete(dataFactory.dmdiiEventUpdateUrl(id).delete, {}, function() {
                    $scope.updates.splice(index, 1);
                });
            };

          }
        }
      }
  ).directive('tabDocuments', function () {
      return {
          restrict: 'E',
          templateUrl: 'templates/dmdii-event-page/tab-documents.html',
          scope:{
            documents: '=',
            userData: '=',
            _event: '='
          },
          controller: function ($scope,$mdDialog,$rootScope,ajax,dataFactory,DMCUserModel) {

            $scope.deleteDocument = function(id, type, index) {
                ajax.delete(dataFactory.deleteDMDIIDocument(id), {}, function() {
                    if (type != 'doc') {
                    } else {
                        $scope.documents.splice(index, 1);
                    }
                });
            };

          }
        }
      }
  )
