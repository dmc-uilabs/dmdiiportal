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
        '$http',
        '$q',
        'toastModel',
        '$rootScope',
        function (ajax,
                  DMCUserModel,
                  dataFactory,
                  $stateParams,
                  $http,
                  $q,
                  toastModel,
                  $rootScope) {

            this.add_members_to_project = function(array,currentMembers, callback){

                var promises = {};

                for(var i in array){
                    var isFound = false;
                    for(var j in currentMembers){
                        if(array[i].id === +currentMembers[j].profileId){
                            currentMembers.splice(j,1);
                            isFound = true;
                            break;
                        }
                    }
                    if(!isFound){

                        promises["addMember"+i] = $http.post(dataFactory.createMembersToProject(), {
                                "profileId": array[i].id,
                                "projectId": $stateParams.projectId,
                                "fromProfileId": $rootScope.userData.profileId,
                                "from": $rootScope.userData.displayName,
                                "date": moment(new Date).format('x'),
                                "accept": false
                            }
                        );
                    }
                }

                if(currentMembers.length > 0) {
                    for (var i in currentMembers) {
                        promises["deleteMember"+i] = $http.delete(dataFactory.deleteProjectMember(currentMembers[i].id));
                    }
                }

                $q.all(promises).then(function(){
                        callback();
                    }, function(res){
                        toastModel.showToast("error", "Error." + res.statusText);
                    }
                );
            };

        }
    ]
);
