'use strict';
/**
* dmc.component.productcard Module
*
* DMC Tree Menu
*/

var updateFavoriteInShowProductCtrl = null;

angular.module('dmc.component.productcard', [
    'dmc.ajax',
    'dmc.data',
    'ngCookies',
    'dmc.compare',
    'dmc.component.members-card'
])
.run(function(ajax){
        // get all projects and save to $rootScope
        // need for add service to project
        // ajax.loadProjects();
})
.directive('dmcProductCard', function(){
     return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        cardSource: '=',
        typeProduct: '=',
        cardStyle: '=',
        removeFeatured: '=',
        addFeatured: '=',
        hideButtons: '='
      },
      templateUrl: 'templates/components/product-card/product-card-tpl.html',
      controller: function($scope, $rootScope, $cookies,$timeout,ajax,dataFactory, $mdDialog, previousPage,CompareModel,DMCUserModel){

          $scope.descriptionLenLimit=140;
          $scope.descriptionLenLimitPrompt = 'more';

          $scope.switchDescriptionLenLimit = function() {
            if ($scope.descriptionLenLimit == $scope.cardSource.description.length) {
              $scope.descriptionLenLimit = 140
              $scope.descriptionLenLimitPrompt = 'more';
            } else {
              $scope.descriptionLenLimit = $scope.cardSource.description.length;
              $scope.descriptionLenLimitPrompt = 'less';
            }
          }

          $scope.descriptionTooLong = function() {
            return 140 < $scope.cardSource.description.length;
          }

          var userData = null;
          DMCUserModel.getUserData().then(function(res){
              userData = res;
              // get compared services
              // below should already be called in the marketplace controller
              // CompareModel.get('services',userData);
          });

          $scope.previousPage = previousPage;
          $scope.images = [];

          if ($scope.cardSource.published) {
              if (!angular.isDefined($scope.cardSource.images)) {
                  ajax.get(dataFactory.documentsUrl().getList, {parentType: 'SERVICE', parentId: $scope.cardSource.id, docClass: 'IMAGE', recent: 5}, function(response) {
                      if(response.data && response.data.data && response.data.data.length) {
                          $scope.cardSource.images = response.data.data;
                      }
                  });

              }

              if (!angular.isDefined($scope.cardSource.ownerName)) {
                  ajax.get(dataFactory.userAccount($scope.cardSource.owner).get, {}, function(response) {
                      $scope.cardSource.ownerName = response.data.displayName;
                  });
              }
          }
          //$scope.hideButtons = [];
          $scope.compareStyle = {
              'font-size' : ($scope.hideButtons && $scope.hideButtons.indexOf('compare') != -1 ? '11px' : '13px')
          };

          $scope.projects = [];
          $scope.addingToProject = false;

          // success callback for add to favorites
          var addToFavoriteCallback = function(response){
              $scope.cardSource.favorite = response.data;
              $rootScope.$broadcast('UpdateFavorite');
              if(updateFavoriteInShowProductCtrl) updateFavoriteInShowProductCtrl($scope.cardSource);
              apply();
          };

          // success callback for remove from favorites
          var removeFromFavoritesCallback = function(response){
              $scope.cardSource.favorite = false;
              $rootScope.$broadcast('UpdateFavorite');
              if(updateFavoriteInShowProductCtrl) updateFavoriteInShowProductCtrl($scope.cardSource);
              apply();
          };

          $scope.addToFavorite = function(){
            if(!$scope.cardSource.favorite){
                // add to favorites
                var requestData = { 'accountId': $scope.$root.userData.accountId };
                if($scope.cardSource.type == 'service'){
                    requestData.serviceId = $scope.cardSource.id;
                }else if($scope.cardSource.type == 'component'){
                    requestData.componentId = $scope.cardSource.id;
                }
                ajax.create(dataFactory.addFavorite(), requestData, addToFavoriteCallback );
            }else{
                // remove from favorites
                ajax.delete(dataFactory.deleteFavorite($scope.cardSource.favorite.id), {}, removeFromFavoritesCallback);
            }
          };

          var apply = function(){
              if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
          };

          $scope.addToFeatured = function(){
              $scope.addFeatured($scope.cardSource);
          };

          $scope.removeFromFeatured = function(ev){
              $scope.removeFeatured($scope.cardSource,ev);
          };

          $scope.addedTimout = null;
          $scope.backToAdd = function(){
              $scope.cardSource.added = false;
              clearTimeout($scope.addedTimeout);
              if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
          };

          // add service to project
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
                    updatedItem.owner = userData.accountId;
                    updatedItem.projectId = project.id;
                    updatedItem.from = 'marketplace';
                    updatedItem.published = false;
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
                        if ($scope.images.length) {
                            angular.forEach($scope.images, function(image) {
                                delete image.id;
                                image.ownerId = userData.accountId;
                                image.parentId = id;
                                ajax.create(dataFactory.documentsUrl().save, image)
                            });
                        };
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

          $scope.loadProjects = function() {
              $scope.projects = $scope.$root.projects;
          };

          // remove service from compare
          $scope.removeFromCompare = function(){
              if($scope.typeProduct == 'service') {
                  CompareModel.delete('services',$scope.cardSource.id);
              }
          };

          // get service to compare
          $scope.addToCompare = function(){
              ajax.loadProjects();

              if($scope.typeProduct == 'service'){
                  CompareModel.add('services',{
                      profileId : userData.profileId,
                      serviceId : $scope.cardSource.id
                  });
              }
          };

          $scope.addToProject = function(){
              $scope.addingToProject = true;
          };

          $scope.cancelAddToProject = function(){
              $scope.addingToProject = false;
          };

          $scope.share = function(ev){
              $mdDialog.show({
                  controller: 'ShareProductCtrl',
                  templateUrl: 'templates/components/product-card/share-product.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose:true,
                  locals: {
                      serviceId : ($scope.cardSource.id ? $scope.cardSource.id : 1)
                  }
              }).then(function() {
                  $(window).unbind('beforeunload');
              }, function() {
                  $(window).unbind('beforeunload');
              });
          };

          var scrollPosition;
          $scope.show = function(ev){
              scrollPosition = $(window).scrollTop();
              $mdDialog.show({
                  controller: 'ShowProductCtrl',
                  templateUrl: 'templates/components/product-card/show-product.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose:true,
                  locals: {
                      addToFavorite : $scope.addToFavorite,
                      getProduct : $scope.cardSource
                  }
              }).then(function() {
                  $(window).scrollTop(scrollPosition);
              }, function() {
                  $(window).scrollTop(scrollPosition);
              });
          }
      }
    };
})
.controller('ShowProductCtrl', function ($scope, ajax, dataFactory, $mdDialog, getProduct, addToFavorite){
        $scope.product = getProduct;

        function apply(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }

        function getTags(){
            ajax.get(dataFactory.services($scope.product.id).get_tags,{},function(response){
                $scope.product.tags = response.data;
                apply();
            })
        }
        getTags();

        function getDocs(){
            ajax.get(dataFactory.documentsUrl($scope.product.id).getList,{page: 0, pageSize: 5, parentType: 'SERVICE', parentId: $scope.product.id, docClass: 'SUPPORT'},function(response){
                if (response.data && response.data.data) {
                    $scope.productDocuments = response.data.data;
                }
                apply();
            })
        }
        getDocs();

        $scope.searchByTag = function(e){
            $scope.cancel();
        };

        $scope.addToFavorite = addToFavorite;
            updateFavoriteInShowProductCtrl = function(data){
            $scope.product = data;
            apply();
        };

        $scope.cancel = function(){
            updateFavoriteInShowProductCtrl = null;
            $mdDialog.hide();
        };

        $scope.share = function(ev){
            var share = $mdDialog.show({
                controller: 'ShareProductCtrl',
                templateUrl: 'templates/components/product-card/share-product.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                locals: {
                    serviceId : ($scope.product.id ? $scope.product.id : 1)
                }
            }).then(function() {
                $(window).unbind('beforeunload');
            }, function() {
                $(window).unbind('beforeunload');
            });
        };

        $scope.filter = {
            block: null,
            time: null,
            type: null
        };

        $scope.statistics = [
            {
                title: 'Project',
                'SuccessfulRuns': {
                    'Today': 8,
                    'Week': 10,
                    'AllTime': 12
                },
                'IncompleteRuns': {
                    'Today': 1,
                    'Week': 3,
                    'Month': 3
                },
                'UnavailableRuns': {
                    'Today': 1,
                    'Week': 2,
                    'Month': 2
                },
                'RunsByUsers': {
                    'Today': 10,
                    'Week': 15,
                    'AllTime': 17
                },
                'UniqueUsers': {
                    'Today': 10,
                    'Week': 2,
                    'Month': 5
                },
                'AverageTime': {
                    'Today': 10.1,
                    'Week': 11,
                    'Month': 22.2
                }
            },
            {
                title: 'Marketplace',
                'SuccessfulRuns': {
                    'Today': 8,
                    'Week': 10,
                    'AllTime': 12
                },
                'IncompleteRuns': {
                    'Today': 1,
                    'Week': 3,
                    'Month': 3
                },
                'UnavailableRuns': {
                    'Today': 1,
                    'Week': 2,
                    'Month': 2
                },
                'RunsByUsers': {
                    'Today': 10,
                    'Week': 15,
                    'AllTime': 17
                },
                'UniqueUsers': {
                    'Today': 10,
                    'Week': 2,
                    'Month': 5
                },
                'AverageTime': {
                    'Today': 10.1,
                    'Week': 11,
                    'Month': 22.2
                }
            }
        ]
}).service('isFavorite', ['dataFactory','ajax', '$rootScope','DMCUserModel', function(dataFactory,ajax, $rootScope, DMCUserModel) {
    this.check = function(items) {
        var userData = DMCUserModel.getUserData();
        userData.then(function(){
            if (items && items.length > 0){
                var services_id = [];
                var components_id = [];

                for (var i in items) {
                    if (items[i].type == 'service') {
                        services_id.push(items[i].id);
                    } else if (items[i].type == 'component') {
                        components_id.push(items[i].id);
                    }
                }

                var check = function(data){
                    for (var i in items) {
                        items[i].favorite = false;
                        for (var j in data) {
                            if ((data[j].serviceId && items[i].type == 'service' && items[i].id == data[j].serviceId) ||
                                (data[j].componentId && items[i].type == 'component' && items[i].id == data[j].componentId)) {
                                items[i].favorite = data[j];
                                break;
                            }
                        }
                    }
                };

                var callback = function (response) {
                    check(response.data);
                };

                // services
                if( services_id.length > 0 ) ajax.get(dataFactory.getFavorites(), { accountId: userData.accountId, serviceId: services_id }, callback );
                // components
                if( components_id.length > 0 ) ajax.get(dataFactory.getFavorites(), { accountId: userData.accountId, componentId: components_id }, callback );
            }
        });
    };
}])
.controller('ShareProductCtrl', function ($scope, $rootScope, $mdDialog,toastModel,ajax,dataFactory,serviceId,DMCUserModel ){
        $scope.share = {
            user : null
        };

        $scope.users = {};

        $scope.userData = DMCUserModel.getUserData();
        $scope.userData.then(function(res){
            $scope.userData = res;
        });

        $scope.users.items = [];
        $scope.users.querySearch   = querySearch;
        $scope.users.selectedItemChange = selectedItemChange;
        $scope.users.searchTextChange   = searchTextChange;
        function querySearch (query) {
            var results = query ? $scope.users.items.filter( createFilterFor(query) ) : $scope.users.items,
                deferred;
            return results;
        }
        function searchTextChange(text) {
            //$log.info('Text changed to ' + text);
        }
        function selectedItemChange(item) {

        }

        $(window).unbind('beforeunload');
        $(window).bind('beforeunload', function(val){
            return '';
        });

        function getAllUser(){
            ajax.get(dataFactory.profiles().all,{},function(response){
                $scope.users.items = response.data.map( function (profile) {
                    return {
                        profile: profile,
                        value: profile.displayName.toLowerCase(),
                        display: profile.displayName
                    };
                });
                apply();
            });
        }
        getAllUser();

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(user) {
                return (user.value.indexOf(lowercaseQuery) === 0);
            };
        }

        function apply(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }

        $scope.shareService = function(id){
            ajax.create(dataFactory.shareService(),{
                accountId : $rootScope.userData.accountId,
                profileId :  id,
                serviceId : serviceId
            },function(response){
                toastModel.showToast('success','Service successfully shared');
                $scope.cancel();
            });
        };

        $scope.cancel = function(){
            $mdDialog.cancel();
        };
})
