'use strict';

angular.module('dmc.release-notes')

    .controller('release-notes-controller', ['$stateParams', '$state', "$scope", "ajax", 'dataFactory', function ($stateParams, $state, $scope, ajax, dataFactory) {
          var getV015= function() {
              ajax.get(dataFactory.getStaticJSON('notesV015.json'), {}, function(response){
                  $scope.notesV015 = response.data;
              });
          }
          getV015();

          var getV016= function() {
              ajax.get(dataFactory.getStaticJSON('notesV016.json'), {}, function(response){
                  $scope.notesV016 = response.data;
              });
          }
          getV016();

          var getV017= function() {
              ajax.get(dataFactory.getStaticJSON('notesV017.json'), {}, function(response){
                  $scope.notesV017 = response.data;
              });
          }
          getV017();
    }]
);
