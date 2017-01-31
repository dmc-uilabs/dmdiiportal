'use strict';
angular.module('dmc.component.documentinfo', [
    'dmc.ajax',
    'dmc.data',
    'ngCookies',
])
.directive('dmcDocumentInfo', function(){
     return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
      },
      templateUrl: 'templates/components/documents/document-info.tpl.html'
    }
})
.controller('DocumentInfoController', function ($scope, ajax, dataFactory, $mdDialog){

  $scope.logIt = function(){
    console.log('WTF WTF WTF WTF');
  };

  $scope.testElement = 'testy test test';

  $scope.logIt();
})
