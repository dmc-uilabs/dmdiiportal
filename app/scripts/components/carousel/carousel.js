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
        functions: "=",
        typeCarousel: "=",
        nameCarousel: "=",
        maxItems: '=',
        showItems: '=',
        carouselSource: '=',
        runCarousel: '=',
        edit: '='
      },
      templateUrl: 'templates/components/carousel/carousel-tpl.html',
      link: function(scope, element, attrs){

      },
      controller: function($element,$scope,$timeout,Carousel,socketFactory,$animate){
          $element.addClass($scope.nameCarousel);
          $scope.intervalCarousel = null;
          $animate.enabled(false);
          $scope.maxItems = (parseInt($scope.maxItems) <= 0 ? 10 : parseInt($scope.maxItems));
          $scope.showItems = (parseInt($scope.showItems) <= 0 ? 2 : parseInt($scope.showItems));
          $scope.arrayItems = ($scope.carouselSource.length > $scope.maxItems ? $scope.carouselSource.slice(0, $scope.maxItems) : $scope.carouselSource);
          $scope.countSlides = ($scope.arrayItems.length == 0 ? 0 : Math.ceil($scope.arrayItems.length / $scope.showItems));
          $scope.currentSlide = 1;

          $scope.$watch(function(){return $scope.carouselSource.length}, function(){
              $scope.arrayItems = ($scope.carouselSource.length > $scope.maxItems ? $scope.carouselSource.slice(0, $scope.maxItems) : $scope.carouselSource);
              $scope.countSlides = ($scope.arrayItems.length == 0 ? 0 : Math.ceil($scope.arrayItems.length / $scope.showItems));
              if(Carousel.get($scope.nameCarousel).slidesCount){
                Carousel.get($scope.nameCarousel).slidesCount = $scope.countSlides;
                if(Carousel.get($scope.nameCarousel).currentSlide + 1 > $scope.countSlides){
                  Carousel.get($scope.nameCarousel).toIndex(0);
                }
              }
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

          $scope.selectButton = function(){
              $scope.currentSlide = Carousel.get($scope.nameCarousel).currentSlide + 1;
              if (!isNaN($scope.currentSlide)) {
                  $element.find(".slide-buttons .selected").removeClass("selected");
                  $element.find(".slide-buttons li:nth-child(" + $scope.currentSlide + ")").addClass("selected");
              }
          };

          //var heightInterval;
          //$scope.$watch("arrayItems",function(){
          //    heightInterval = setInterval(function(){
          //        $scope.setHeight();
          //    },500);
          //});

          $scope.$watch(function(){
              return $('.'+$scope.nameCarousel+' .carousel-items slidecontainer').height();
          },function(newHeight){
              if(newHeight) {
                  $element.find(".ng-carousel").css("height", (newHeight + 65) + "px");
              }
          });

          //$scope.setHeight = function(){
          //    var maxHeight = 0;
          //    $element.find(".product-card").each(function(){
          //        if($(this).height() > maxHeight) maxHeight = $(this).height();
          //    });
          //    $element.find(".carousel-item").each(function(){
          //        if($(this).height() > maxHeight) maxHeight = $(this).height();
          //    });
          //    $element.find(".ng-carousel").css("height", (maxHeight + 65) + "px");
          //    if(heightInterval && $element.find(".ng-carousel").height() > 100) clearInterval(heightInterval);
          //};

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
