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
      replyFunction: "=",
      flaggedFunction: "=",
      helpfulFunction: "="
    },
    controller: function($scope, ajax, dataFactory, $stateParams) {
      $scope.replyFlag = false;  //flag for visibility form Reply
      $scope.flagReviewFlag = false;  //flag for visibility form Flag Review
      $scope.flagReplyReviewFlag = false;  //flag for visibility form Flag Review
      $scope.showReply = false;
      //Show Reply form
      $scope.Reply = function(){
        $scope.replyFlag = !$scope.replyFlag;
        $scope.flagReviewFlag = false;
      };

      //Show Flag Review form
      $scope.FlagReview = function(index){
        $scope.flagReviewFlag = !$scope.flagReviewFlag;
        $scope.replyFlag = false;
        $scope.flagReplyReviewFlag = false;
      };

      //Show Flag Review form
      $scope.ReplyFlagReview = function(index){
        if($scope.flagReplyReviewFlag === index){
          $scope.flagReplyReviewFlag = false;
        }else{
          $scope.flagReplyReviewFlag = index;
        }
        $scope.flagReviewFlag = false;
        $scope.replyFlag = false;
      };

      //cancel Review form
      $scope.Cancel = function(){
        $scope.flagReviewFlag = false;
        $scope.replyFlag = false;
        $scope.flagReplyReviewFlag = false;
      };


      //Submit Leave A Review form
      $scope.Submit = function(NewReview){
        NewReview.id = $scope.review.id;
        $scope.replyFunction(NewReview);

        $scope.review.reply = true;
        $scope.showReply = true;
        $scope.flagReviewFlag = false;
        $scope.replyFlag = false;
        $scope.flagReplyReviewFlag = false;
      };

      //Submit Flag Review form
      $scope.SubmitReview = function(NewReview){
        NewReview.id = $scope.review.id;
        $scope.flaggedFunction(NewReview);
        
        $scope.review['flagged'] = true;
        $scope.flagReplyReviewFlag = false;
        $scope.flagReviewFlag = false;
        $scope.replyFlag = false;
      };

      $scope.ShowReply = function(){
        $scope.showReply = !$scope.showReply;
      };

      //Like review
      $scope.Like = function(item){
        if(item.helpful){
          if(item.helpful.helpful === true){
            item.helpful.helpful = null;
            item.like--;
          }else if(item.helpful.helpful === false){
            item.helpful.helpful = true;
            item.like++;
            item.dislike--;
          }else{
            item.helpful.helpful = true;
            item.like++;
          }
          $scope.helpfulFunction(item);
        }else{
          item.like++;
          $scope.helpfulFunction(item, true, true);
        }
      };

      //DisLike review
      $scope.DisLike = function(item){
        if(item.helpful){
          if(item.helpful.helpful === true){
            item.helpful.helpful = false;
            item.dislike++;
            item.like--;
          }else if(item.helpful.helpful === false){
            item.helpful.helpful = null;
            item.dislike--;
          }else{
            item.helpful.helpful = false;
            item.dislike++;
          }
          $scope.helpfulFunction(item);
        }else{
          item.dislike++;
          $scope.helpfulFunction(item, true, false);
        }
      };

    }
  } 
}]);
