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
            $scope.review.replyReviews.push(data);
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
      $scope.Like = function(item){
        if(item.userRatingReview[$scope.userlogin] == "none"){
          item.like++;
          item.userRatingReview[$scope.userlogin] = 'like';
        }else if(item.userRatingReview[$scope.userlogin] == 'like'){
          item.like--;
          item.userRatingReview[$scope.userlogin] = "none";
        }else{
          item.like++;
          item.userRatingReview[$scope.userlogin] = 'like';
          item.dislike--;
        }
        ajax.on(
          dataFactory.addLikeDislike(),
          {
            reviewId: item.id,
            like: item.like,
            dislike: item.dislike,
            ratingReview: item.userRatingReview[$scope.userlogin],
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
      $scope.DisLike = function(item){
        if(item.userRatingReview[$scope.userlogin] == "none"){
          item.dislike++;
          item.userRatingReview[$scope.userlogin] = 'dislike';
        }else if(item.userRatingReview[$scope.userlogin] == 'dislike'){
          item.dislike--;
          item.userRatingReview[$scope.userlogin] = "none";
        }else{
          item.dislike++;
          item.userRatingReview[$scope.userlogin] = 'dislike';
          item.like--;
        }
        ajax.on(
          dataFactory.addLikeDislike(),
          {
            reviewId: item.id,
            like: item.like,
            dislike: item.dislike,
            ratingReview: item.userRatingReview[$scope.userlogin],
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
