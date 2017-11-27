'use strict';

angular.module('dmc.component.product-card-buttons',[
        'dmc.ajax'
    ]).
    directive('productCardButtonsMarketplace', function () {
        return {
            restrict: 'E',
            controller: 'productCardButtonsCtrl',
            templateUrl: 'templates/components/product-card-buttons/productCard.html',
            scope: {
                cardSource: '=',
                typeProduct: '='
            }
        };
    }).
    directive('productCardButtonsProfile', function () {
        return {
            restrict: 'E',
            controller: 'productCardButtonsCtrl',
            templateUrl: 'templates/components/product-card-buttons/appProfile.html',
            scope: {
              cardSource: '=',
              typeProduct: '='
            }
        };
    }).
    directive('productCardButtonsCompare', function () {
        return {
            restrict: 'E',
            controller: 'productCardButtonsCtrl',
            templateUrl: 'templates/components/product-card-buttons/compare.html',
            scope: {
              cardSource: '=',
              typeProduct: '='
            }
        };
    }).
    controller('productCardButtonsCtrl', function($scope, $rootScope, ajax, dataFactory, DMCUserModel, CompareModel){

      $scope.projects = [];
      $scope.addingToProject = false;

      $scope.userData = null;
      DMCUserModel.getUserData().then(function(res){
          $scope.userData = res;
          // get compared services
          // this is already being done in the marketplace controller
          // CompareModel.get('services',userData);
      });

      var apply = function(){
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
      };

      var acceptedInvite = function(project){
        return project.accept == true;
      }

      var isMember = function(project){
        for (var i in $scope.filtered_response){
          if (project.id == $scope.filtered_response[i].projectId) return true;
        }
        return false;
      }


      $scope.searchWorkspace=function(queryWs){
        queryWs=queryWs.toLowerCase();
        var item =$scope.projects.filter(function (obj){
          if (obj.title.toLowerCase().includes(queryWs)){
            return obj;
          }
        });
        return item;
      }


      var addCardProjects = function(projects) {
        var unfiltered_projects = projects;
        // $scope.projects=projects;
        // Filter projects for only projects that user is a member of
        ajax.get(dataFactory.getMembersToProject(),{
            profileId : $scope.userData.profileId
        },function(response){
          $scope.filtered_response = response.data.filter(acceptedInvite);
          $scope.projects = unfiltered_projects.filter(isMember);
        });
      }

      $scope.addToProject = function(){
        if (!$rootScope.projects) {
          ajax.loadProjects(addCardProjects);
        }
        else{
          addCardProjects($rootScope.projects);
        }
        $scope.addingToProject = true;
      };

      $scope.cancelAddToProject = function(){
          $scope.addingToProject = false;
      };

      $scope.backToAdd = function(){
          $scope.cardSource.added = false;
          clearTimeout($scope.addedTimeout);
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
      };


      $scope.saveToProject = function(projectId){
          var project = null;
          for(var i in $scope.projects){
              if($scope.projects[i].id == projectId){
                  project = $scope.projects[i];
                  break;
              }
          }

          if(project) {
              var updatedItem = $.extend(true, {}, $scope.cardSource);
              if (updatedItem.hasOwnProperty('$$hashKey')) {
                  delete updatedItem['$$hashKey'];
              }
              updatedItem.currentStatus = {
                  project: {
                      id: project.id,
                      title: project.title
                  }
              };
              updatedItem.owner = $scope.userData.accountId;
              updatedItem.projectId = project.id;
              updatedItem.from = 'marketplace';
              updatedItem.published = false;
              updatedItem.parent = updatedItem.id;
              delete updatedItem.tags;
              ajax.create(dataFactory.services().add, updatedItem, function (response) {
                  var id = response.data.id;
                  $scope.cancelAddToProject();

                  ajax.get(dataFactory.services($scope.cardSource.id).get_tags, {}, function(response) {
                      angular.forEach(response.data, function(tag) {
                          delete tag.id;
                          tag.serviceId = id;
                          ajax.create(dataFactory.services(id).add_tags, tag);
                      });
                  });
                  ajax.get(dataFactory.services($scope.cardSource.id).get_interface, {}, function(response) {
                      angular.forEach(response.data, function(newDomeInterface) {
                          delete newDomeInterface.id;
                          newDomeInterface.serviceId = id;
                          ajax.create(dataFactory.services().add_interface, newDomeInterface);
                      });
                  });

                  if(!$scope.cardSource.currentStatus) $scope.cardSource.currentStatus = {};
                  if(!$scope.cardSource.currentStatus.project) $scope.cardSource.currentStatus.project = {};
                  $scope.cardSource.currentStatus.project.id = projectId;
                  $scope.cardSource.currentStatus.project.title = project.title;
                  $scope.cardSource.projectId = projectId;
                  $scope.cardSource.added = true;

                  $scope.cardSource.lastProject = {
                      title: project.title,
                      href: '/project.php#/' + project.id + '/home'
                  };
                  $scope.addedTimeout = setTimeout(function () {
                      $scope.cardSource.added = false;
                      apply();
                  }, 20000);
                  apply();
              });
          }
      };

      $scope.removeFromCompare = function(){
          if($scope.typeProduct == 'service') {
              CompareModel.delete('services',$scope.cardSource.id);
          }
      };

      $scope.addToCompare = function(){
          if($scope.typeProduct == 'service'){
              CompareModel.add('services',{
                  profileId : $scope.userData.profileId,
                  serviceId : $scope.cardSource.id
              });
          }
      };

    });
