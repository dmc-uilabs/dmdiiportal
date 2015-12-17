'use strict';

angular.module('dmc.widgets.review',[
  'dmc.ajax',
  'dmc.data',
  'dmc.widgets.stars',
])
.directive('uiWidgetReview', [function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/components/ui-widgets/review.html',
    transclude: true,
    replace: true,
    scope: {
      review: "=",
      userlogin: "=",
    },
    controller: function($scope, ajax, dataFactory, $stateParams) {
      $scope.replyFlag = false;  //flag for visibility form Reply
      $scope.flagReviewFlag = false;  //flag for visibility form Flag Review
      $scope.showReply = false;
      //Show Reply form
      $scope.Reply = function(){
        $scope.replyFlag = !$scope.replyFlag;
        $scope.flagReviewFlag = false;
      }

      //Show Flag Review form
      $scope.FlagReview = function(index){
        $scope.flagReviewFlag = !$scope.flagReviewFlag;
        $scope.replyFlag = false;
      }

      //cancel Review form
      $scope.Cancel = function(){
        $scope.flagReviewFlag = false;
        $scope.replyFlag = false;
      };

      //Submit Leave A Review form
      $scope.Submit= function(NewReview){
        console.info("review", NewReview);
        ajax.on(
          dataFactory.addProductReview(),
          {
            productId: $stateParams.productId,
            productType: $stateParams.typeProduct,
            name: "DMC Member",
            reviewId: $scope.review.id,
            status: true,
            rating: 0,
            comment: NewReview.Comment
          },
          function(data){
            $scope.review.replyReviews.unshift(data);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
          },
          function(){
            alert("Ajax fail: getProductReview");
          },
          "POST"
        );

        $scope.review.reply = true;
        $scope.showReply = true;
        $scope.flagReviewFlag = false;
        $scope.replyFlag = false;
      };

      $scope.ShowReply = function(){
        $scope.showReply = !$scope.showReply;
      }

      //Like review
      $scope.Like = function(){
        if($scope.review.userRatingReview[$scope.userlogin] == "none"){
          $scope.review.like++;
          $scope.review.userRatingReview[$scope.userlogin] = 'like';
        }else if($scope.review.userRatingReview[$scope.userlogin] == 'like'){
          $scope.review.like--;
          $scope.review.userRatingReview[$scope.userlogin] = "none";
        }else{
          $scope.review.like++;
          $scope.review.userRatingReview[$scope.userlogin] = 'like';
          $scope.review.dislike--;
        }
        ajax.on(
          dataFactory.addLikeDislike(),
          {
            reviewId: $scope.review.id,
            like: $scope.review.like,
            dislike: $scope.review.dislike,
            ratingReview: $scope.review.userRatingReview[$scope.userlogin],
            userLogin: $scope.userlogin
          },
          function(data){
          },
          function(){
            alert("Ajax fail: getProductReview");
          },
          "POST"
        );
      };

      //DisLike review
      $scope.DisLike = function(){
        if($scope.review.userRatingReview[$scope.userlogin] == "none"){
          $scope.review.dislike++;
          $scope.review.userRatingReview[$scope.userlogin] = 'dislike';
        }else if($scope.review.userRatingReview[$scope.userlogin] == 'dislike'){
          $scope.review.dislike--;
          $scope.review.userRatingReview[$scope.userlogin] = "none";
        }else{
          $scope.review.dislike++;
          $scope.review.userRatingReview[$scope.userlogin] = 'dislike';
          $scope.review.like--;
        }
        ajax.on(
          dataFactory.addLikeDislike(),
          {
            reviewId: $scope.review.id,
            like: $scope.review.like,
            dislike: $scope.review.dislike,
            ratingReview: $scope.review.userRatingReview[$scope.userlogin],
            userLogin: $scope.userlogin
          },
          function(data){
          },
          function(){
            alert("Ajax fail: getProductReview");
          },
          "POST"
        );
      };

    }
  } 
}]);
