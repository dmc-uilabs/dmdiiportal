'use strict';

angular.module('dmc')
.controller('ProductCtr', function ($stateParams, $scope, ajax, dataFactory) {

    $scope.product = [];  //array product
    $scope.number_of_comments = 0; // number of reviews
    $scope.sort_review = '-date';  // sorting reviews
    $scope.LeaveFlag = false;  //flag for visibility form Leave A Review
    $scope.submit_rating = 0;  //
    $scope.not_found = false;  //product not fount
    $scope.products_card = [];  //products card
    $scope.limit_reviews = true;  //limit reviews
    $scope.sort_order = 'DESC';  //sorting order
    $scope.sort = 'date';  //type sorting
    $scope.precentage_stars = [0,0,0,0,0]; //precentage stars
    $scope.average_rating = 0;  //average rating


    $scope.currentImage = 1;
    $scope.images = [];
    for(var i=0;i<10;i++){
      $scope.images.push({
        id : i+1,
        src : (i%2 == 0 ? 'images/marketplace-card-image-1.jpg' : 'images/project_generator.png'),
        selected : (i == 0 ? true : false)
      });
    }
    $scope.carouselFunctions = {
      openImage : function(item){
        for(var i in $scope.images){
          if($scope.images[i].selected){
            $scope.images[i].selected = false;
            break;
          }
        }
        item.selected = true;
        $(".product-image .main-image").attr("src",item.src);
      }
    };

    //get product
    ajax.on(
      dataFactory.getProduct(),
      {
        typeProduct: $stateParams.typeProduct,
        productId: $stateParams.productId
      },
      function(data){
        if(data.result.id) {
          $scope.product = data.result;
          $scope.number_of_comments = $scope.product.rating.length;
          if($scope.number_of_comments != 0) {
            calculate_rating();
          }
        }else{
          $scope.not_found = true;
        }
      },
      function(){
        alert("Ajax fail: getProduct");
      }
    );

    ajax.on(
      dataFactory.getUrlAllServices(),
      {
        limit: 4
      },
      function(data){
        $scope.products_card = data.result;
      },
      function(){
        alert("Ajax fail: getAllServices");
      }
    );

    //Calculate Rating
    var calculate_rating = function() {
      $scope.precentage_stars = [0,0,0,0,0];
      $scope.average_rating = 0;
      for (var i in $scope.product.rating) {
        $scope.precentage_stars[$scope.product.rating[i] - 1] += 100 / $scope.number_of_comments;
        $scope.average_rating += $scope.product.rating[i];
      }
      $scope.average_rating = ($scope.average_rating / $scope.number_of_comments).toFixed(1);

      for (var i in $scope.precentage_stars) {
        $scope.precentage_stars[i] = Math.round($scope.precentage_stars[i]);
      }
    };

    //Show Leave A Review form
    $scope.LeaveAReview = function(){
      $scope.LeaveFlag = !$scope.LeaveFlag;
    };

    //cancel Leave A Review form
    $scope.Cancel = function(){
      $scope.LeaveFlag = !$scope.LeaveFlag;
    };

    //Submit Leave A Review form
    $scope.Submit= function(NewReview){
      ajax.on(
        dataFactory.addProductReview(),
        {
          productId: $scope.product.id,
          productType: $stateParams.typeProduct,
          name: NewReview.Name,
          status: true,
          rating: $scope.submit_rating,
          like: 0,
          dislike: 0,
          comment: NewReview.Comment
        },
        function(data){
          $scope.product.reviews.push(data);
        },
        function(){
          alert("Ajax fail: getProductReview");
        },
        "POST"
      );

      $scope.number_of_comments++;
      $scope.product.rating.push($scope.submit_rating);
      $scope.submit_rating = 0;
      $scope.LeaveFlag = !$scope.LeaveFlag;
      calculate_rating();
    };

    //sorting Reviews
    $scope.SortingReviews = function(val){
      if(val == 0) {
        $scope.sort = 'date';
        $scope.sort_order = 'DESC';

      }
      if(val == 1) {
        $scope.sort = 'rating';
        $scope.sort_order = 'DESC';
      }
      if(val == 2) {
        $scope.sort = 'rating';
        $scope.sort_order = 'ASC';
      }
      if(val == 3) {
        $scope.sort = 'verified';
        $scope.sort_order = 'ASC';
      }

      var params = {
        typeProduct: $stateParams.typeProduct,
        productId: $stateParams.productId,
        sort: $scope.sort,
        order: $scope.sort_order
      };
      if ($scope.limit_reviews){
        params['limit'] = 2;
      }

      ajax.on(
        dataFactory.getProductReview(),
        params,
        function(data){
          $scope.product.reviews = data.result;
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        },
        function(){
          alert("Ajax fail: getProductReview");
        }
      );

    };

    //View All Review
    $scope.ViewAllReview = function(){
      $scope.limit_reviews = !$scope.limit_reviews;
      var params = {
        typeProduct: $stateParams.typeProduct,
        productId: $stateParams.productId,
        sort: $scope.sort,
        order: $scope.sort_order
      };
      if ($scope.limit_reviews){
        params['limit'] = 2;
      }

      ajax.on(
        dataFactory.getProductReview(),
        params,
        function(data){
          $scope.product.reviews = data.result;
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        },
        function(){
          alert("Ajax fail: getProductReview");
        }
      );

    };

    //selected rating
    $scope.stars = function(val){
      $scope.submit_rating = val;
    };

    $scope.Like = function(review){
      review.like++;
    };

    $scope.DisLike = function(review){
      review.dislike++;
    };

  });
