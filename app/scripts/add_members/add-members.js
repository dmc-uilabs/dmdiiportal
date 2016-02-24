'use strict';
angular.module('dmc.add_members', [
  'dmc.configs.ngmaterial',
  'ngMdIcons',
  'ngtimeago',
  'ui.router',
  'dmc.ajax',
  'dmc.data',
  'dmc.widgets.documents',
  'dmc.component.members-card',
  'dmc.compare',
  'dmc.common.header',
  'dmc.common.footer',
  'dmc.model.member',
  'dmc.model.user'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
    $stateProvider.state('product', {
      url: '/:projectId',
      templateUrl: 'templates/add_members/add-members.html',
      controller: 'AddMembersController'
    });
    $urlRouterProvider.otherwise('/1');
  })
.directive('dmcSelectedInvitees', function () {
    return {
        restrict: 'A',
        templateUrl: 'templates/components/add-project/selected-invitees-tpl.html',
        scope:{
            invitees: '='
        },
        controller: function ($scope) {

            $scope.removeInvite = function(item){
                for(var i in $scope.invitees){
                    if($scope.invitees[i].id === item.id){
                        $scope.invitees.splice(i,1);
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        break;
                    }
                }
            };



            $scope.clear = function(){
                $scope.invitees = [];
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };
        }
    }
})
.service('projectModel', [
        'ajax',
        'DMCUserModel',
        'dataFactory',
        '$stateParams',
        'toastModel',
        '$rootScope',
        function (ajax,
                  DMCUserModel,
                  dataFactory,
                  $stateParams,
                  toastModel,
                  $rootScope) {

            this.add_members_to_project = function(array, callback){
                for(var i in array){
                    ajax.create(dataFactory.createMembersToProject(),
                        {
                            "profileId": array[i].id,
                            "projectId": $stateParams.projectId,
                            "fromProfileId": $rootScope.userData.profileId,
                            "from": $rootScope.userData.displayName,
                            "date": moment(new Date).format('x'),
                            "accept": false
                        },
                        function(response){
                            $rootScope.userData.messages.items.splice($rootScope.userData.messages.items.length-1, 1);
                            $rootScope.userData.messages.items.unshift({
                                "user_name": $rootScope.userData.displayName,
                                "image": "/uploads/profile/1/20151222084711000000.jpg",
                                "text": "Invited you to a project",
                                "link": "/project.php#/preview/" + $stateParams.projectId,
                                "created_at": moment().format("hh:mm A")
                            });
                            DMCUserModel.UpdateUserData($rootScope.userData);
                            if(i == array.length-1){
                              callback();
                            }
                        }
                    );
                }
                //callback();
            };

        }
    ]
);
  