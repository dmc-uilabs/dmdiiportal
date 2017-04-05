'use strict';

angular.module('dmc.release-notes')
    .controller('release-notes-controller', ['$stateParams', '$state', "$scope", "ajax", 'dataFactory', function ($stateParams, $state, $scope, ajax, dataFactory) {
          var getV015= function() {
              ajax.get(dataFactory.getStaticJSON('notesV015.json'), {}, function(response){
                  $scope.notes = response.data;
              });
          }
          getV015();

    }]
);
