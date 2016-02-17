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
.directive('dmcTopHeader', ['$window', 'DMCUserModel', '$mdMenu', '$rootScope', function($window, userModel, $mdMenu, $rootScope){
  return {
    restrict: 'A',
    scope: {
      showNotification: '=',
      activePage: '=',
      //userData: '='
    },
    templateUrl: 'templates/common/header/header-tpl.html',
    controller : function($scope){
        $scope.userData;
        $scope.userName = userModel.getUserName();
        userModel.getUserData().then(
          function(response){
            var data = response.data ? response.data : response;
            if (data.accountId) {
              initUserData(data);
            }
          }
        )

        var initUserData = function(data) {
          $scope.userData = data;
          $scope.userProfileId = $scope.userData.profileId;
          $scope.userAccountId = $scope.userData.accountId;
          $scope.userCompanyId = $scope.userData.companyId;

          $scope.runningServicesList = $scope.userData.runningServices.items;
          $scope.messagesList = $scope.userData.messages.items;
          $scope.notificationsList = $scope.userData.notifications.items;

          $scope.service_alert = $scope.userData.runningServices.total;

          $scope.notification_alert = $scope.userData.notifications.total;
          $scope.message_alert = $scope.userData.messages.total;
        }

        $scope.setDropDown = function(event,width){
            width = $(event.currentTarget).width()+12;
        }

        $scope.login = function(){
          userModel.login();
        }

        $scope.logout = function(){
          userModel.logout();
        }

        $scope.closeMenu = function(){
          $mdMenu.cancel();
        }

    }
  };
}]);
