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
  'dmc.common.header',
  'dmc.common.footer'
])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
    $stateProvider.state('profile', {
      url: '/',
      templateUrl: 'templates/profile/profile.html',
      controller: 'ProfileController'
    });
    $urlRouterProvider.otherwise('/');
  })
  .controller('ProfileController', function ($stateParams, $scope, ajax, dataFactory, $mdDialog) {
    
    $scope.number_of_comments = 30; // number of reviews
    $scope.submit_rating = 0;  //
    $scope.precentage_stars = [15,10,50,15,10]; //precentage stars

    $scope.LeaveFlag = false;  //flag for visibility form Leave A Review
    $scope.replyFlag = -1;  //flag for visibility form Reply
    $scope.flagReviewFlag = -1;  //flag for visibility form Flag Review

    $scope.profile = {
      name: "Thomas Smith",
      company: "General Electric (GE) Global Research",
      position: "Engineering Manager",
      city: "Berkeley",
      state: "California",
      image: "images/marketplace-icon.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio.",
      average_rating: 3.4,
      reviews: [
        {
          "id": 1,
          "productId": 20,
          "productType": "services",
          "name": "Jessica H. Wheaton",
          "status": true,
          "date": "22-09-2015 11:00:18",
          "rating": 1,
          "like": 1,
          "dislike": 0,
          "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio."
        },
        {
          "id": 2,
          "productId": 20,
          "productType": "services",
          "name": "Jessica H. Wheaton",
          "status": false,
          "date": "22-09-2015 10:20:18",
          "rating": 2,
          "like": 2,
          "dislike": 0,
          "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio."
        }
      ]
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
  });
