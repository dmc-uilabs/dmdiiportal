'use strict';

angular.module('dmc.profile', [
  'dmc.configs.ngmaterial',
  'ngMdIcons',
  'ngtimeago',
  'ui.router',
  'md.data.table',
  'dmc.ajax',
  'dmc.data',
  'dmc.socket',
  'dmc.widgets.stars',
  'dmc.widgets.review',
  'dmc.common.header',
  'dmc.common.footer'
])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
    $stateProvider.state('profile', {
      url: '/:profileId',
      templateUrl: 'templates/profile/profile.html',
      controller: 'ProfileController'
    });
    $urlRouterProvider.otherwise('/1');
  })
  .controller('ProfileController', function ($stateParams, $scope, ajax, dataFactory, $mdDialog) {
    
    $scope.profile = [];  //array product
    $scope.number_of_comments = 0; // number of 
    $scope.LeaveFlag = false;  //flag for visibility form Leave A Review
    $scope.submit_rating = 0;  //
    $scope.limit_reviews = true;  //limit reviews
    $scope.precentage_stars = [0,0,0,0,0]; //precentage stars
    $scope.average_rating = 0;  //average rating$scope.products = [];   //included services
    $scope.editFlag = false;  //flag edit page
    $scope.UserLogin = "DMC Member";
    $scope.sortListModel = 0;

    $scope.sortList = [
      {
        id: 0,
        val: "date",
        name: "Most recent"
      },
      {
        id: 1,
        val: "helpful",
        name: "Most Helpful"
      },
      {
        id: 2,
        val: "highest", 
        name: "Highest to Lowest Rating"
      },
      {
        id: 3,
        val: "lowest", 
        name: "Lowest to Highest Rating"
      },
      {
        id: 4,
        val: "verified",
        name: "Verified Users"
      }
    ];

    ajax.on(
      dataFactory.getProfile(),
      {
        profileId: $stateParams.profileId
      },
      function(data){
        $scope.profile = data.result;
        $scope.number_of_comments = $scope.profile.rating.length;
        if($scope.number_of_comments != 0) {
          calculate_rating();
        }
        console.info("get profile", $scope.profile);
        $scope.SortingReviews($scope.sortList[0].val);
      },
      function(){
        alert("Ajax fail: getProduct");
      }
    );

    var calculate_rating = function() {
      $scope.precentage_stars = [0,0,0,0,0];
      $scope.average_rating = 0;
      for (var i in $scope.profile.rating) {
        $scope.precentage_stars[$scope.profile.rating[i] - 1] += 100 / $scope.number_of_comments;
        $scope.average_rating += $scope.profile.rating[i];
      }
      $scope.average_rating = ($scope.average_rating / $scope.number_of_comments).toFixed(1);

      for (var i in $scope.precentage_stars) {
        $scope.precentage_stars[i] = Math.round($scope.precentage_stars[i]);
      }
    };

//review
    //Show Leave A Review form
    $scope.LeaveAReview = function(){
      $scope.LeaveFlag = !$scope.LeaveFlag;
    };

    //cancel Review form
    $scope.Cancel = function(){
      $scope.LeaveFlag = false;
    };

    //Submit Leave A Review form
    $scope.Submit= function(NewReview){
      ajax.on(
        dataFactory.addProfileReview(),
        {
          profileId: $scope.profile.id,
          reviewId: 0,
          name: "DMC Member",
          status: true,
          rating: $scope.submit_rating,
          comment: NewReview.Comment
        },
        function(data){
          $scope.SortingReviews('date');
        },
        function(){
          alert("Ajax fail: getProductReview");
        },
        "POST"
      );


      $scope.number_of_comments++;
      $scope.profile.rating.push($scope.submit_rating);
      $scope.submit_rating = 0;
      $scope.LeaveFlag = !$scope.LeaveFlag;
      calculate_rating();
    };

    $scope.selectItemDropDown = function(value){
      if(value != 0) {
          var item = $scope.sortList[value];
          $scope.sortList.splice(value, 1);
          $scope.sortList = $scope.sortList.sort(function(a,b){return a.id - b.id});
          if ($scope.sortList.unshift(item)) this.sortListModel = 0;
      }
      $scope.SortingReviews($scope.sortList[0].val);
    };

    //sorting Reviews
    $scope.SortingReviews = function(val){
      var sort;
      var order;
      switch(val){
        case "date":
          sort = 'date';
          order = 'DESC';
          break
        case "helpful":
          sort = 'helpful';
          order = 'DESC';
          break
        case "lowest":
          sort = 'rating';
          order = 'ASC';
          break
        case "highest":
          sort = 'rating';
          order = 'DESC';
          break
        case "verified":
          sort = 'verified';
          order = 'ASC';
          break
        case "1star":
          sort = 'stars';
          order = 1;
          break
        case "2star":
          sort = 'stars';
          order = 2;
          break
        case "3star":
          sort = 'stars';
          order = 3;
          break
        case "4star":
          sort = 'stars';
          order = 4;
          break
        case "5star":
          sort = 'stars';
          order = 5;
          break
      }

      var params = {
        profileId: $stateParams.profileId,
        sort: sort,
        order: order
      };
      if ($scope.limit_reviews){
        params['limit'] = 2;
      }

      ajax.on(
        dataFactory.getProfileReview(),
        params,
        function(data){
          $scope.profile.reviews = data.result;
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        },
        function(){
          alert("Ajax fail: getProfileReview");
        }

      );
    };

    //Selected rating
    $scope.stars = function(val){
      $scope.submit_rating = val;
    };

    //View All Review
    $scope.ViewAllReview = function(){
      $scope.limit_reviews = !$scope.limit_reviews;
      $scope.SortingReviews($scope.sortList[0].val);
    };
  });
