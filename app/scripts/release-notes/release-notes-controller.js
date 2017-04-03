'use strict';

angular.module('dmc.release-notes')
    .controller('release-notes-controller', ['$stateParams', '$state', "$scope", "ajax", function ($stateParams, $state, $scope, ajax) {
      $scope.notes = [
        {
          content: "Some text!",
          notes: [
            {content: "im one layer deep",
            notes: [
              {content: "im TWO layers deep!"}
            ]
            },
            {content: "im one layer deep",
            notes: [
              {content: "two",
              notes: [
                {content: "threee!!!!!!!!!"}
              ]
              }
            ]
            }
          ]
        },
        {
          content: "Some other text!"
        }
      ]
    }]
);
