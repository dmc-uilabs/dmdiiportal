'use strict';

angular.module('dmc.product', [
  'dmc.configs.ngmaterial',
  'ngMdIcons',
  'ngtimeago',
  'ui.router',
  'md.data.table',
  'dmc.ajax',
  'dmc.data',
  'dmc.socket',
  'dmc.widgets.stars',
  'dmc.widgets.documents',
  'dmc.component.treemenu',
  'dmc.component.productcard',
  'dmc.common.header',
  'dmc.common.footer',
  'dmc.component.carousel'
])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
    //$locationProvider.html5Mode(true).hashPrefix('#');
    $stateProvider.state('product', {
      url: '/:typeProduct/:productId',//
      templateUrl: 'templates/product/product.html',
      controller: 'ProductController'
    });
    $urlRouterProvider.otherwise('/service/1');
  })
  .controller('ProductController', function ($stateParams, $scope, ajax, dataFactory, $mdDialog) {

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
    $scope.replyFlag = -1;  //flag for visibility form Reply
    $scope.flagReviewFlag = -1;  //flag for visibility form Flag Review
    $scope.products = [];   //included services
    $scope.editFlag = false;  //flag edit page
    $scope.allServices = [];

    $scope.currentImage = 1;
    $scope.images = [];
    var img = [
      'images/marketplace-card-image-1.jpg',
      'images/3d-printing.png',
      'images/project_generator.png',
      'images/plasticity.png',
      'images/project-1-image.jpg',
      'images/project_relay_controller.png',
      'images/project_controller_pg2.png',
      'images/project_capacitor-bank.png',
      'images/project_capacitor_compartment.png',
      'images/ge-fuel-cell.png'
    ]
    for(var i=0;i<10;i++){
      $scope.images.push({
        id : i+1,
        //src : (i%2 == 0 ? 'images/marketplace-card-image-1.jpg' : 'images/project_generator.png'),
        src : img[i],
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
        $scope.qqq = $scope.product;
        }else{
          $scope.not_found = true;
        }
      },
      function(){
        alert("Ajax fail: getProduct");
      }
    );

    //get included services
    ajax.on(
      dataFactory.getUrlAllServices(),
      {
        limit: 8
      },
      function(data){
        $scope.products = data.result;
      },
      function(){
        alert("Ajax fail: getAllServices");
      }
    );

    //get similar product
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

    ajax.on(
      dataFactory.getUrlAllProducts(),
      {},
      function(data){
        $scope.allServices = data.result;  
      },
      function(){
        console.error("Ajax fail! getAllProducts()");
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
      $scope.replyFlag = -1;
      $scope.flagReviewFlag = -1;
    };

    //Show Reply form
    $scope.Reply = function(index){
      $scope.replyFlag = index;
      $scope.LeaveFlag = false;
      $scope.flagReviewFlag = -1;
    }

    //Show Flag Review form
    $scope.FlagReview = function(index){
      $scope.flagReviewFlag = index;
      $scope.LeaveFlag = false;
      $scope.replyFlag = -1;
    }

    //cancel Review form
    $scope.Cancel = function(){
      $scope.LeaveFlag = false;
      $scope.replyFlag = -1;
      $scope.flagReviewFlag = -1;
    };

    //Submit Leave A Review form
    $scope.Submit= function(NewReview){
      ajax.on(
        dataFactory.addProductReview(),
        {
          productId: $scope.product.id,
          productType: $stateParams.typeProduct,
          name: "DMC Member",
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

    //View All Included
    $scope.ViewIncluded = function(ev){
      $mdDialog.show({
        controller: "ViewIncludedController",
        templateUrl: "templates/product/view_included.html",
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function() {
      }, function() {
      });
    }

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

    $scope.submitSearch = function(text){
      window.location.href = '/marketplace.php#/search/' + $stateParams.typeProduct +'s?text=' + text;
    }

    $scope.editPage = function () {
      $scope.editFlag = true;
    }

    $scope.querySearch = function(query) {
      var results = query ? $scope.allServices.filter( createFilterFor(query) ) : $scope.allServices;
      
        return results;
    }

    $scope.AddServices = function(item, text){
      if(!item)return;
      $scope.products.push(item);
      this.$$childHead.$mdAutocompleteCtrl.clear();
    }

    //Create filter function for a query string
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (angular.lowercase(state.title).indexOf(lowercaseQuery) === 0);
      };
    }

    $scope.deleteIncluded = function(index){
      $scope.products.splice(index, 1);
    }

    $scope.saveEdit = function(){
      ajax.on(
        dataFactory.editProduct(),
        {
          typeProduct: $scope.product.type,
          productId: $scope.product.id,
          title: $scope.product.title,
          tags: $scope.product.tags,
          description: $scope.product.description,
        },
        function(data){
        },
        function(){
          console.error("Ajax fail! editProduct()");
        },
        "POST"
      );
      $scope.editFlag = false;
    }


    $scope.treeMenuModel = {
        title: 'BROWSE BY',
        data: [
            {
                'id': 1,
                'title': 'All',
                'tag' : 'all',
                'items': 0,
                'opened' : $scope.currentPage == 'all' ? true : false,
                'onClick' : function(){
                    $location.url('/all');
                },
                'categories': []
            },
            {
                'id': 2,
                'title': 'Components',
                'tag' : 'components',
                'items': 0,
                'opened' : $scope.currentPage == 'components' ? true : false,
                'onClick' : function(){
                    $location.url('/components');
                },
                'categories': []
            },
            {
                'id': 3,
                'title': 'Services',
                'tag' : 'services',
                'items': 0,
                'opened' : $scope.currentPage == 'services' ? true : false,
                'onClick' : function(){
                    $location.url('/services');
                },
                'categories': [
                    {
                        'id': 31,
                        'title': 'Analytical Services',
                        'tag' : 'analytical',
                        'items': 0,
                        'opened' : $scope.currentPageType == 'analytical' ? true : false,
                        'onClick' : function(){
                            $location.url('/services?type=analytical');
                        },
                        'categories': []
                    },
                    {
                        'id': 32,
                        'title': 'Solid Services',
                        'tag' : 'solid',
                        'items': 0,
                        'opened' : $scope.currentPageType == 'solid' ? true : false,
                        'onClick' : function(){
                            $location.url('/services?type=solid');
                        },
                        'categories': []
                    },
                    {
                        'id': 33,
                        'title': 'Data Services',
                        'tag' : 'data',
                        'items': 0,
                        'opened' : $scope.currentPageType == 'data' ? true : false,
                        'onClick' : function(){
                            $location.url('/services?type=data');
                        },
                        'categories': []
                    }
                ]
            }
        ]
    };

  })
  .controller("ViewIncludedController", function ($scope, ajax, dataFactory, $mdDialog, $location) {
    $scope.products = [];
    $scope.product = null;
    ajax.on(
      dataFactory.getUrlAllProducts(),
      {},
      function(data){
        $scope.products = data.result;
        for(var i in $scope.products){
          $scope.products[i].average_rating = 0;
          var number_of_comments = $scope.products[i].rating.length;
          if(number_of_comments != 0) {
            var average_rating = 0;
            for (var k in $scope.products[i].rating) {
              average_rating += $scope.products[i].rating[k];
            }
            $scope.products[i].average_rating = (average_rating / number_of_comments).toFixed(1);
          }
        }
        $scope.product = $scope.products[0];
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
      },
      function(){
        console.error("Ajax fail! getAllProducts()");
      }
    );
    $scope.cancel = function(){
      $mdDialog.cancel();
    }
    $scope.View = function(index){
      $scope.product = $scope.products[index];
    }
  });
