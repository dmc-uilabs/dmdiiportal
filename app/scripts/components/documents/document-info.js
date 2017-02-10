'use strict';
angular.module('dmc.component.documentinfo', [
    'dmc.ajax',
    'dmc.data',
    'ngCookies'
])
.directive('dmcDocumentInfo', function(){
     return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'templates/components/documents/document-info.tpl.html'
    }
})
.controller('dmcDocumentInfoController',
    '$scope',
    '$rootScope',
    'ajax',
    function($scope,
             $rootScope,
             ajax,
             $window){





    })
