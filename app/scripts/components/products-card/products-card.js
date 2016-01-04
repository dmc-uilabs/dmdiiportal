'use strict';
/**
* dmc.component.productscard Module
*
* DMC Tree Menu
*/

angular.module('dmc.component.productscard', [
    'dmc.component.productcard',
    'angularUtils.directives.dirPagination',
    'ngCookies'
])
.directive('dmcProductsCard', function(){
     return {
      restrict: 'E',
      transclude: true,
      scope: {
          cardSource : "=",
          totalSize : "=",
          pageSize : "=",
          currentPage : "=",
          titleCard: "=",
          cardLoading: "=",
          searchCard: "=",
          updatePageSize : "=",
          addFeatured : "=",
          hideButtons : "="
      },
      templateUrl: 'templates/components/products-card/products-card-tpl.html',
      controller: function($scope,$cookies){
          if(parseInt($scope.currentPage) <= 0) $scope.currentPage = 1;
          if(!$scope.hideButtons) $scope.hideButtons = [];
          $scope.itemsArray = [];

          $scope.sortArray = [{
             id : 1, val : 'popular', name: 'Most Popular'
          }];
          $scope.pageSort = 0;

          $scope.filterItems = [{
              id : 1,
              name : "Analytical Services"
          },{
              id : 2,
              name : "4 Stars & Up"
          }];

          $scope.showArray = [
              {
                  id : 1, val:10, name: '10 items'
              },
              {
                  id : 2, val:25, name: '25 items'
              },
              {
                  id : 3, val:50, name: '50 items'
              },
              {
                  id : 4, val:100, name: '100 items'
              },
              {
                  id : 5, val:$scope.totalSize, name: 'All items'
              }
          ];

          $scope.sizeModule = 0;
          for(var i in $scope.showArray){
              if($scope.showArray[i].val == $scope.pageSize){
                  $scope.sizeModule = i;
                  break;
              }
          }


          $scope.selectItemDropDown = function(type){
              if(type == "show"){
                  if($scope.sizeModule != 0) {
                      var item = $scope.showArray[$scope.sizeModule];
                      $scope.pageSize = item.val;
                      $scope.updatePageSize(item.val);
                      $scope.showArray.splice($scope.sizeModule, 1);
                      $scope.showArray = $scope.showArray.sort(function(a,b){return a.id - b.id});
                      if ($scope.showArray.unshift(item)) $scope.sizeModule = 0;
                  }
              }else{
                  if($scope.pageSort != 0) {
                      var item = $scope.sortArray[$scope.pageSort];
                      $scope.sortArray.splice($scope.pageSort, 1);
                      $scope.sortArray = $scope.sortArray.sort(function(a,b){return a.id - b.id});
                      if ($scope.sortArray.unshift(item)) $scope.pageSort = 0;
                  }
              }
          };

          $scope.updateData = function(){
              $scope.itemsArray = new Array($scope.totalSize);
              for(var i=0;i<$scope.itemsArray.length;i++) $scope.itemsArray[i] = i;
              var j = ($scope.currentPage-1)*$scope.pageSize;
              for(var i=0;i<$scope.cardSource.arr.length;i++){
                  $scope.itemsArray[j] = $scope.cardSource.arr[i];
                  j++;
              }
          };
          $scope.updateData();

          $scope.$watch(function() { return $cookies.updateProductCard; }, function(newValue) {
              $scope.updateData();
          });

          $scope.$watch('cardSource', function(){
              $scope.updateData();
          });

          $scope.pageChangeHandler = function(num) {
              $scope.currentPage = num;
              $cookies.changedPage = num;
          };

          $scope.clearFilter = function(){

          };


      }
    };
});
