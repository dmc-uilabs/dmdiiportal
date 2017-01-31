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
        selectedDocument: '='
      },
      templateUrl: 'templates/components/documents/document-info.tpl.html',
      controller: function($scope) {
      }
    }
})
