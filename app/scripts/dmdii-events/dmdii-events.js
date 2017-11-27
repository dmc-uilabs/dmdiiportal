'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiEvents', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngSanitize',
    'ng-showdown',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'ngtimeago',
    'ngCookies',
    'angularUtils.directives.dirPagination',
    'angular-horizontal-timeline',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.component.treemenu',
    'dmc.component.horizontalmenu',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs',
    'dmc.recent-news',
    'dmc.model.question-toast-model',
    'tien.clndr'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('dmdii_events', {
        url: '/dmdii_events?status?rootNumber?callNumber?statusId?focusId?thrustId',
        templateUrl: 'templates/dmdii-events/dmdii-events.html',
        controller: 'DMCDmdiiEventsController'
    })
    // .state('dmdii_events_search', {
		// url: '/dmdii_events/search?status?rootNumber?callNumber?statusId?focusId?thrustId',
    //     templateUrl: 'templates/dmdii-projects/dmdii-projects.html',
    //     controller: 'DMCDmdiiProjectsController',
    //     resolve: {
    //         is_search: function() {
    //             return true;
    //         }
    //     }
    // });
    .state('view_event', {
      url: '/event/:eventId',
      templateUrl: 'templates/dmdii-events/view-event.html',
      controller: 'DMCDmdiiEventPageController'
    })
    $urlRouterProvider.otherwise('/dmdii_events');
}).directive('tabSchedule', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/dmdii-project-page/tab-schedule.html',
        scope:{
          projectSchedule: '=',
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
).directive('tabDocuments', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/dmdii-project-page/tab-documents.html',
        scope:{
          documents: '=',
          userData: '=',
          project: '='
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
;
