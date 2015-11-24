'use strict';
/**
* dmc.component.productcard Module
*
* DMC Tree Menu
*/
angular.module('dmc.component.carousel', [
    'angular-carousel',
    'dmc.socket'
]).
  directive('dmcCarousel', function(){
     return {
      restrict: 'A',
      scope: {
        nameCarousel: "=",
        maxItems: '=',
        showItems: '=',
        carouselSource: '=',
        runCarousel: '='
        //timeout: '=' // seconds
      },
      templateUrl: 'templates/components/carousel/carousel-tpl.html',
      link: function(scope, element, attrs){

      },
      controller: function($element,$scope,$timeout,Carousel,socketFactory){
          $scope.intervalCarousel = null;

          //$scope.timeout = (parseInt($scope.timeout) <= 0 ? 5 : parseInt($scope.timeout));
          $scope.maxItems = (parseInt($scope.maxItems) <= 0 ? 10 : parseInt($scope.maxItems));
          $scope.showItems = (parseInt($scope.showItems) <= 0 ? 2 : parseInt($scope.showItems));
          $scope.arrayItems = ($scope.carouselSource.length > $scope.maxItems ? $scope.carouselSource.slice(0, $scope.maxItems) : $scope.carouselSource);
          $scope.countSlides = ($scope.arrayItems.length == 0 ? 0 : Math.ceil($scope.arrayItems.length / $scope.showItems));

          $scope.$watch('carouselSource', function(){
              $scope.arrayItems = ($scope.carouselSource.length > $scope.maxItems ? $scope.carouselSource.slice(0, $scope.maxItems) : $scope.carouselSource);
              $scope.countSlides = ($scope.arrayItems.length == 0 ? 0 : Math.ceil($scope.arrayItems.length / $scope.showItems));
          });

          $scope.nextSlide = function(){
              Carousel.get($scope.nameCarousel).next();
              $scope.selectButton();
          };

          $scope.prevSlide = function(){
              Carousel.get($scope.nameCarousel).previous();
              $scope.selectButton();
          };

          $scope.openSlide = function($event,number){
              $($event.currentTarget).parents(".slide-buttons").find(".selected").removeClass("selected");
              $($event.currentTarget).addClass("selected");
              Carousel.get($scope.nameCarousel).toIndex(number);
          };

          /*
          $scope.run = function(){
              if($scope.runCarousel == true && $scope.countSlides > 1) {
                  $scope.intervalCarousel = setInterval(function () {
                      $scope.nextSlide();
                      $scope.selectButton();
                  }, $scope.timeout * 1000);
              }
          };
          */

          $scope.selectButton = function(){
              var cs = Carousel.get($scope.nameCarousel).currentSlide + 1;
              if (!isNaN(cs)) {
                  $element.find(".slide-buttons .selected").removeClass("selected");
                  $element.find(".slide-buttons li:nth-child(" + cs + ")").addClass("selected");
              }
          };

          /*
          $scope.stop = function(){
              if($scope.intervalCarousel != null) clearInterval($scope.intervalCarousel);
          };

          $element.mouseover(function() {
              $scope.stop();
          }).mouseout(function() {
              $scope.run();
          });
          */

          var h = setInterval(function(){
              if($element.find(".ng-carousel").height() < 100) $scope.setHeight();
          },100);

          $scope.setHeight = function(){
              var maxHeight = 0;
              $element.find(".product-card").each(function(){
                  if($(this).height() > maxHeight) maxHeight = $(this).height();
              });
              $element.find(".ng-carousel").css("height", (maxHeight + 65) + "px");
              if($element.find(".ng-carousel").height() > 100) clearInterval(h);
          };

          var updateItem = function(item){
              for(var i=0;i<$scope.arrayItems.length;i++){
                  if($scope.arrayItems[i].id == item.id){
                      $scope.arrayItems[i] = item;
                      break;
                  }
              }
          };

          //socketFactory.on(socketFactory.updated().services, function(item){
          //    if($scope.arrayItems.length > 0 && $scope.arrayItems[0].type == 'service'){
          //        updateItem(item);
          //    }
          //});
          //
          //socketFactory.on(socketFactory.updated().components, function(item){
          //    if($scope.arrayItems.length > 0 && $scope.arrayItems[0].type == 'component'){
          //        updateItem(item);
          //    }
          //});
      }
    };
});
