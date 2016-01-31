'use strict';
/**
* dmc.common.header Module
*
* Global Header
*/
angular.module('dmc.common.header', ['ngAnimate', 'dmc.model.user'])
.config(function($animateProvider) {
    $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
})
.directive('dmcTopHeader', ['$window', 'DMCUserModel', function($window, userModel){
  return {
    restrict: 'A',
    scope: {
      showNotification: '=',
      activePage: '=',
      userData: '='
    },
    templateUrl: 'templates/common/header/header-tpl.html',
    controller : function($scope){
        $scope.userData;
        userModel.getUserData().then(function(response){
          $scope.userData = response;
          $scope.userProfileId = response.profileId;
          $scope.userAccountId = response.accountId;
          $scope.userCompanyId = response.companyId;

          $scope.runningServicesList = response.runningServices.items;
          $scope.messagesList = response.messages.items;
          $scope.notificationsList = response.notifications.items;

          $scope.service_alert = response.runningServices.total;

          $scope.notification_alert = response.notifications.total;
          $scope.message_alert = response.messages.total;
        })


        $scope.setDropDown = function(event,width){
            width = $(event.currentTarget).width()+12;
        }

        $scope.userName = $window.givenName || 'DMC Member';
    }
  };
}]);
