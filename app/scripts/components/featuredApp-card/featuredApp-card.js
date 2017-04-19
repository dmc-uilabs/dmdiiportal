'use strict';
/**
* dmc.component.featuredApp Module
*
* DMC Tree Menu
*/

angular.module('dmc.component.featuredAppcard', [
    'dmc.component.productcard',
    'dmc.ajax',
    'dmc.data',
    'ngCookies',
    'dmc.compare',
    'dmc.component.members-card',
    'dmc.component.product-card-buttons'
])


.directive('dmcFeaturedAppCard', function(){
     return {
       restrict:'E',
       transclude:true,
      scope: {
          cards : '=',
      },
      templateUrl: 'templates/components/featuredApp-card/featuredApp-card-tpl.html',
      controller: function($scope, $rootScope, $cookies,$timeout,ajax,dataFactory, $mdDialog, previousPage,CompareModel,DMCUserModel){


        $scope.projects = [];
        $scope.addingToProject = false;


        $scope.$watch(function(){return $scope.cards.length}, function(){
          $scope.items = $scope.cards;
          var numberApps = $scope.items.length;
          var randId = Math.floor(Math.random()*numberApps);
          $scope.randApp = $scope.items[randId];
        });

        var userData = null;
        DMCUserModel.getUserData().then(function(res){
            userData = res;
            // get compared services
            // this is already being done in the marketplace controller
            // CompareModel.get('services',userData);
        });

        $scope.addedTimout = null;
        $scope.backToAdd = function(){
            $scope.cardSource.added = false;
            clearTimeout($scope.addedTimeout);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };

        $scope.addToProject = function(){
          if (!$rootScope.projects) {
            ajax.loadProjects();
          }
            $scope.addingToProject = true;
        };

        $scope.cancelAddToProject = function(){
            $scope.addingToProject = false;
        };

        $scope.loadProjects = function() {
            $scope.projects = $scope.$root.projects;
        };

        // Need to implement save to projects

        $scope.addToCompare = function(){
            if($scope.randApp.type == 'service'){
                CompareModel.add('services',{
                    profileId : userData.profileId,
                    serviceId : $scope.randApp.id
                });
            }
        };


        // remove service from compare
        $scope.removeFromCompare = function(){
            if($scope.randApp.type == 'service') {
                CompareModel.delete('services',$scope.randApp.id);

            }
        };

        $scope.images=[];

        var apply = function(){
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
                var updatedItem = $.extend(true, {}, $scope.randApp);
                if (updatedItem.hasOwnProperty('$$hashKey')) {
                    delete updatedItem['$$hashKey'];
                }
                updatedItem.currentStatus = {
                    project: {
                        id: project.id,
                        title: project.title
                    }
                };
                updatedItem.owner = userData.accountId;
                updatedItem.projectId = project.id;
                updatedItem.from = 'marketplace';
                updatedItem.published = false;
                delete updatedItem.tags;
                ajax.create(dataFactory.services().add, updatedItem, function (response) {
                    var id = response.data.id;
                    $scope.cancelAddToProject();

                    ajax.get(dataFactory.services($scope.randApp.id).get_tags, {}, function(response) {
                        angular.forEach(response.data, function(tag) {
                            delete tag.id;
                            tag.serviceId = id;
                            ajax.create(dataFactory.services(id).add_tags, tag);
                        });
                    });
                    if ($scope.images.length) {
                        angular.forEach($scope.images, function(image) {
                            delete image.id;
                            image.ownerId = userData.accountId;
                            image.parentId = id;
                            ajax.create(dataFactory.documentsUrl().save, image)
                        });
                    };
                    ajax.get(dataFactory.services($scope.randApp.id).get_interface, {}, function(response) {
                        angular.forEach(response.data, function(newDomeInterface) {
                            delete newDomeInterface.id;
                            newDomeInterface.serviceId = id;
                            ajax.create(dataFactory.services().add_interface, newDomeInterface);
                        });
                    });

                    if(!$scope.randApp.currentStatus) $scope.randApp.currentStatus = {};
                    if(!$scope.randApp.currentStatus.project) $scope.randApp.currentStatus.project = {};
                    $scope.randApp.currentStatus.project.id = projectId;
                    $scope.randApp.currentStatus.project.title = project.title;
                    $scope.randApp.projectId = projectId;
                    $scope.randApp.added = true;

                    $scope.randApp.lastProject = {
                        title: project.title,
                        href: '/project.php#/' + project.id + '/home'
                    };
                    $scope.addedTimeout = setTimeout(function () {
                        $scope.randApp.added = false;
                        apply();
                    }, 20000);
                    apply();
                });
            }
        };




      }
    };
});
