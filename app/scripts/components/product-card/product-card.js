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
  ajax.on(
    dataFactory.getUrlAllProjects(),
    {
      limit : 10, offset: 0
    },
    function(data){
      $rootScope.projects = data.result;
    },
    function(){
      alert("Ajax faild: getProjects");
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
      controller: function($scope,$cookies,$timeout,ajax,dataFactory, $mdDialog){
          // get data from cookies
          var updateCompareCount = function () {
              var arr = $cookies.getObject('compareProducts');
              return arr == null ? {services: [], components: []} : arr;
          };
          $scope.compareProducts = updateCompareCount();

          $scope.projects = [];
          $scope.addingToProject = false;
          var addToFavoriteCallback = function(data){
              if(!data.error) {
                  $scope.cardSource.favorite = data.favorite;
                  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
              }else{
                  alert(data.error);
              }
              if(updateFavoriteInShowProductCtrl) updateFavoriteInShowProductCtrl($scope.cardSource);
          };
          $scope.addToFavorite = function(){
              return ajax.on(dataFactory.addProductToFavorite(),{
                  productId : $scope.cardSource.id,
                  productType : $scope.typeProduct
              },addToFavoriteCallback,function(){
                  alert("Ajax faild: removeFromProject");
              });
          };

          $scope.addToFeatured = function(){
              $scope.addFeatured($scope.cardSource.id,$scope.cardSource.type);
          };

          $scope.removeFromFeatured = function(){
              $scope.removeFeatured($scope.cardSource.id,$scope.cardSource.type);
          };

          $scope.removeFromProject = function(){
              ajax.on(dataFactory.getUrlRemoveFromProject($scope.cardSource.id),{
                  id : $scope.cardSource.id,
                  projectId : $scope.cardSource.currentStatus.project.id,
                  type : $scope.typeProduct
              },function(data){
                  if(data.error == null) {
                      $scope.cardSource.currentStatus.project.id = 0;
                      $scope.cardSource.currentStatus.project.title = null;
                      $scope.cardSource.projectId = 0;
                      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                  }
              },function(){
                  alert("Ajax faild: removeFromProject");
              }, 'POST');
          };

          $scope.addedTimout = null;
          $scope.backToAdd = function(){
              $scope.cardSource.added = false;
              clearTimeout($scope.addedTimeout);
              if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
          };

          $scope.saveToProject = function(projectId){
              ajax.on(dataFactory.getUrlAddToProject($scope.cardSource.id),{
                  id : $scope.cardSource.id,
                  projectId : projectId,
                  type : $scope.typeProduct
              },function(data){
                  $scope.cancelAddToProject();
                  $scope.cardSource.currentStatus.project.id = projectId;
                  $scope.cardSource.projectId = projectId;
                  $scope.cardSource.added = true;
                  var project = null;
                  for(var i in $scope.projects){
                      if($scope.projects[i].id == projectId){
                          project = $scope.projects[i];
                          break;
                      }
                  }
                  $scope.cardSource.lastProject = {
                      title : project.title,
                      href : '/project.php#/'+project.id+'/home'
                  };
                  $scope.addedTimeout = setTimeout(function(){
                      $scope.cardSource.added = false;
                      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                  },10000);
                  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
              },function(){
                  alert("Ajax faild: saveToProject");
              }, 'POST');
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

          $scope.show = function(ev){
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
            })
            .then(function() {
            }, function() {
            });
          }
      }
    };
})
.controller('ShowProductCtrl', function ($scope, $mdDialog, getProduct, addToFavorite){
    $scope.product = getProduct;
    $scope.addToFavorite = addToFavorite;
    updateFavoriteInShowProductCtrl = function(data){
        $scope.product = data;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
    };
    $scope.cancel = function(){
        updateFavoriteInShowProductCtrl = null;
        $mdDialog.cancel();
    }
})
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
.factory('Products', function (ajax,dataFactory) {
        var getServices = function(f,data){
            ajax.on(dataFactory.getUrlAllServices(),data,f,function(){
                console.error("Ajax fail! getServices()");
            });
        };
        var getComponents = function(f,data){
            ajax.on(dataFactory.getUrlAllComponents(),data,f,function(){
                console.error("Ajax fail! getComponents()");
            });
        };

        var getAllProducts = function(f,data){
            ajax.on(dataFactory.getUrlAllProducts(),data,f,function(){
                console.error("Ajax fail! getAllProducts()");
            });
        };

        return {
            get : function(f,type,data){
                switch(type){
                    case 'services':
                        getServices(f,data);
                        break;
                    case 'components':
                        getComponents(f,data);
                        break;
                    case 'all':
                        getAllProducts(f,data);
                        break;
                    default:
                        break;
                }
            }
        };
    }
);
