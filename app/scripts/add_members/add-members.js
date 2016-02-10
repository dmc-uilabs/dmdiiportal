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
    'ajax', 'dataFactory', '$stateParams', 'toastModel',
    function (ajax, dataFactory, $stateParams, toastModel) {
        this.add_members_to_project = function(array, callback){
            ajax.get(dataFactory.createMembersToProject(), 
                {
                    "_limit" : 1,
                    "_order" : "DESC",
                    "_sort" : "id"
                }, 
                function(response){  
                    var lastMemberId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1); 
                    for(var i in array){
                        ajax.create(dataFactory.createMembersToProject(),
                            {
                                "id": lastMemberId,
                                "profileId": array[i].id,
                                "projectId": $stateParams.projectId
                            }
                        );
                        lastMemberId++;
                    }
                    callback();
                }
            ) 
        };            
    }
]);
  