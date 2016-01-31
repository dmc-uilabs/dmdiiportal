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
        userModel.getUserData().then(
          function(response){
            var data = response.data ? response.data : response
            initUserData(data);
        },
          function(response) {
            //  temporary data
            //  remove this when the call is in place.
            var data = {
                "displayName": "Thomas Smith",
                "accountId": 1,
                "profileId": 1,
                "companyId": 1,
                "role": 1,
                "notifications": {
                  "total": 2,
                  "items": [
                    {
                      "title": "Commented on your discussion",
                      "link": "/project.php#/2/run-service/3"
                    }
                  ]
                },
                "runningServices": {
                  "total": 2,
                  "items": [
                    {
                      "title": "Capacitor Bank For Ldr Mining Co",
                      "serviceId": 3,
                      "projectId": 2
                    },
                    {
                      "title": "Incoming Compartment For Ldr Mining",
                      "serviceId": 1,
                      "projectId": 4
                    }
                  ]
                },
                "messages": {
                  "total": 1,
                  "items": [
                    {
                      "title": "Patt has invited you to a challenge",
                      "link": "/project.php#/preview/5"
                    }
                  ]
                }
              }

              initUserData(data);
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

        $scope.userName = $window.givenName || 'DMC Member';
    }
  };
}]);
