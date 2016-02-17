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
    'ngCookies'
])
.run(function($rootScope,ajax,dataFactory){
        // get all projects and save to $rootScope
        // need for add service to project
        ajax.get(
            dataFactory.getProjects(), {},
            function(response){
                $rootScope.projects = response.data;
            }
        );
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
      controller: function($scope, $rootScope, $cookies,$timeout,ajax,dataFactory, $mdDialog){

          // get data from cookies
          var updateCompareCount = function () {
              var arr = $cookies.getObject('compareProducts');
              return arr == null ? {services: [], components: []} : arr;
          };
          $scope.compareProducts = updateCompareCount();

          //$scope.hideButtons = [];

          $scope.projects = [];
          $scope.addingToProject = false;

          // success callback for add to favorites
          var addToFavoriteCallback = function(response){
              $scope.cardSource.favorite = response.data;
              $rootScope.$broadcast("UpdateFavorite");
              if(updateFavoriteInShowProductCtrl) updateFavoriteInShowProductCtrl($scope.cardSource);
              apply();
          };

          // success callback for remove from favorites
          var removeFromFavoritesCallback = function(response){
              $scope.cardSource.favorite = false;
              $rootScope.$broadcast("UpdateFavorite");
              if(updateFavoriteInShowProductCtrl) updateFavoriteInShowProductCtrl($scope.cardSource);
              apply();
          };

          $scope.addToFavorite = function(){
            if(!$scope.cardSource.favorite){
                // add to favorites
                var requestData = { "accountId": $scope.$root.userData.accountId };
                if($scope.cardSource.type == "service"){
                    requestData.serviceId = $scope.cardSource.id;
                }else if($scope.cardSource.type == "component"){
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

          $scope.removeFromFeatured = function(){
              $scope.removeFeatured($scope.cardSource);
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
                  ajax.update(dataFactory.addServiceToProject($scope.cardSource.id), {
                          currentStatus: {
                              project: {
                                  id: project.id,
                                  title: project.title
                              }
                          },
                          projectId: projectId,
                          from: 'marketplace'
                      }, function (response) {
                          $scope.cancelAddToProject($scope.cardSource);
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
                          }, 10000);
                          apply();
                      }
                  );
              }
          };

          $scope.loadProjects = function() {
              $scope.projects = $scope.$root.projects;
          };

          var updateCompareCount = function(){
              var arr = $cookies.getObject('compareProducts');
              return arr == null ? {services : [], components : []} : arr;
          };

          $scope.compareProducts = updateCompareCount();

          $scope.$watch(function() { return $cookies.changedCompare; }, function(newValue) {
              $scope.compareProducts = updateCompareCount();
              if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
          });

          $scope.removeFromCompare = function(){
              var compareProducts = $cookies.getObject('compareProducts');
              if(compareProducts != null){
                  if($scope.typeProduct == 'service') {
                      if($.inArray( parseInt($scope.cardSource.id), compareProducts.services ) != -1){
                          compareProducts.services.splice( $.inArray(parseInt($scope.cardSource.id), compareProducts.services), 1);
                          $cookies.putObject('compareProducts', compareProducts);
                          $cookies.changedCompare = new Date();
                      }
                  }else if($scope.typeProduct == 'component'){
                      if($.inArray( parseInt($scope.cardSource.id), compareProducts.components ) != -1){
                          compareProducts.components.splice($.inArray(parseInt($scope.cardSource.id), compareProducts.components), 1);
                          $cookies.putObject('compareProducts', compareProducts);
                          $cookies.changedCompare = new Date();
                      }
                  }
              }
          };

          $scope.addToCompare = function(){
              // $cookies.remove('compareProducts');
              // Retrieving a cookie
              if($scope.typeProduct == 'service' && $scope.compareProducts.components.length == 0) {
                  if($.inArray( parseInt($scope.cardSource.id), $scope.compareProducts.services ) == -1){
                      $scope.compareProducts.services.push(parseInt($scope.cardSource.id));
                      $cookies.putObject('compareProducts', $scope.compareProducts);
                      $cookies.changedCompare = new Date();
                  }
              }else if($scope.typeProduct == 'component' && $scope.compareProducts.services.length == 0){
                  if($.inArray( parseInt($scope.cardSource.id), $scope.compareProducts.components ) == -1){
                      $scope.compareProducts.components.push(parseInt($scope.cardSource.id));
                      $cookies.putObject('compareProducts', $scope.compareProducts);
                      $cookies.changedCompare = new Date();
                  }
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
                  controller: "ShareProductCtrl",
                  templateUrl: "templates/components/product-card/share-product.html",
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose:true,
                  locals: {
                  }
              }).then(function() {
              }, function() {
              });
          };

          var scrollPosition;
          $scope.show = function(ev){
              scrollPosition = $(window).scrollTop();
              $mdDialog.show({
                  controller: "ShowProductCtrl",
                  templateUrl: "templates/components/product-card/show-product.html",
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
            $mdDialog.cancel();
        };

        $scope.share = function(ev){
            var share = $mdDialog.show({
                controller: "ShareProductCtrl",
                templateUrl: "templates/components/product-card/share-product.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                locals: {
                }
            }).then(function() {
            }, function() {
            });
        };

        $scope.filter = {
            block: null,
            time: null,
            type: null
        };

        $scope.statistics = [
            {
                title: "Project",
                "SuccessfulRuns": {
                    "Today": 8,
                    "Week": 10,
                    "AllTime": 12
                },
                "IncompleteRuns": {
                    "Today": 1,
                    "Week": 3,
                    "Month": 3
                },
                "UnavailableRuns": {
                    "Today": 1,
                    "Week": 2,
                    "Month": 2
                },
                "RunsByUsers": {
                    "Today": 10,
                    "Week": 15,
                    "AllTime": 17
                },
                "UniqueUsers": {
                    "Today": 10,
                    "Week": 2,
                    "Month": 5
                },
                "AverageTime": {
                    "Today": 10.1,
                    "Week": 11,
                    "Month": 22.2
                }
            },
            {
                title: "Marketplace",
                "SuccessfulRuns": {
                    "Today": 8,
                    "Week": 10,
                    "AllTime": 12
                },
                "IncompleteRuns": {
                    "Today": 1,
                    "Week": 3,
                    "Month": 3
                },
                "UnavailableRuns": {
                    "Today": 1,
                    "Week": 2,
                    "Month": 2
                },
                "RunsByUsers": {
                    "Today": 10,
                    "Week": 15,
                    "AllTime": 17
                },
                "UniqueUsers": {
                    "Today": 10,
                    "Week": 2,
                    "Month": 5
                },
                "AverageTime": {
                    "Today": 10.1,
                    "Week": 11,
                    "Month": 22.2
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
                            if ((data[j].serviceId && items[i].type == "service" && items[i].id == data[j].serviceId) ||
                                (data[j].componentId && items[i].type == "component" && items[i].id == data[j].componentId)) {
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
.controller('ShareProductCtrl', function ($scope, $mdDialog){
    $scope.people = [
        { name: 'Janet Perkins', img: 'images/avatar-fpo.jpg', newMessage: true },
        { name: 'Mary Johnson', img: 'images/mackenzie.png', newMessage: false },
        { name: 'Peter Carlsson', img: 'images/carbone.png', newMessage: false }
    ];
    $scope.cancel = function(){
        $mdDialog.cancel();
    };
})
//.factory('Products', function (ajax,dataFactory) {
//        var getServices = function(f,data){
//            ajax.on(dataFactory.getUrlAllServices(),data,f,function(){
//                console.error("Ajax fail! getServices()");
//            });
//        };
//        var getComponents = function(f,data){
//            ajax.on(dataFactory.getUrlAllComponents(),data,f,function(){
//                console.error("Ajax fail! getComponents()");
//            });
//        };
//
//        var getAllProducts = function(f,data){
//            ajax.on(dataFactory.getUrlAllProducts(),data,f,function(){
//                console.error("Ajax fail! getAllProducts()");
//            });
//        };
//
//        return {
//            get : function(f,type,data){
//                switch(type){
//                    case 'services':
//                        getServices(f,data);
//                        break;
//                    case 'components':
//                        getComponents(f,data);
//                        break;
//                    case 'all':
//                        getAllProducts(f,data);
//                        break;
//                    default:
//                        break;
//                }
//            }
//        };
//    }
//);
