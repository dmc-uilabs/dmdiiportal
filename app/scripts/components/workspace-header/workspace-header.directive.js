'use strict';
angular.module('dmc.workspace-header', [])
  .directive('workspaceHeader', function() {
    return{
      restrict: 'AE',
      scope: false,
      templateUrl: 'templates/components/workspace-header/workspace-header-tpl.html',
      controller: ['$scope', function($scope) {

        $scope.$watch('currentPage', function() {

        })

        $scope.pages = [
            {
                id : 1,
                title : 'Home',
                icon : 'home',
                state : 'project.home'
            },
            {
                id : 3,
                title : 'Documents',
                icon : 'my_library_books',
                state : 'project.documents'
            },
            {
                id : 7,
                title : 'Services',
                icon : 'icon_service-white',
                location : 'folder',
                state : 'project.services'
            },
            {
                id : 5,
                title : 'Team',
                icon : 'people',
                state : 'project.team'
            },
            {
                id : 6,
                title : 'Discussions',
                icon : 'forum',
                state : 'project.discussions'
            },
            {
                id : 4,
                title : 'Tasks',
                icon : 'list',
                state : 'project.tasks'
            }
        ];

      }]
    }
  }
)
