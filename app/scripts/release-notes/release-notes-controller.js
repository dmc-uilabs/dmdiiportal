'use strict';

angular.module('dmc.release-notes')
    .controller('release-notes-controller', ['$stateParams', '$state', "$scope", "ajax", function ($stateParams, $state, $scope, ajax) {
      $scope.notes = [
        {
          content: "Some text!"
        },
        {
          content: "Some other text!"
        }
      ]
    }]
);
