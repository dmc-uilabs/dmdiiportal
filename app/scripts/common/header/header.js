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
                  "total": 4,
                  "items": [
                    {
                      "event": "new-contact",
                      "created_at": "8:00 PM",
                      "title": "John Smith added you as a contact",
                      "link": "/profile.php#/1"
                    },
                    {
                      "event": "replied-discussion",
                      "created_at": "6:00 AM",
                      "title": "Bill Gates replied to your discussion",
                      "link": "/individual-discussion.php#/1"
                    },
                    {
                      "event": "new-contact",
                      "created_at": "6:25 PM",
                      "title": "Bill Gates added you as a contact",
                      "link": "/profile.php#/2"
                    },
                    {
                      "event": "replied-discussion",
                      "created_at": "3:12 PM",
                      "title": "John Smith replied to your discussion",
                      "link": "/individual-discussion.php#/1"
                    }
                  ]
                },
                "runningServices": {
                  "total": 2,
                  "items": [
                    {
                      "title": "Capacitor Bank For Ldr Mining Co",
                      "serviceId": 3,
                      "projectId": 2,
                      "currentStatus": {
                        "percentCompleted": "25",
                        "startDate": "09/20/2015",
                        "startTime": "11:15:33"
                      }
                    },
                    {
                      "title": "Incoming Compartment For Ldr Mining",
                      "serviceId": 1,
                      "projectId": 4,
                      "currentStatus": {
                        "percentCompleted": "55",
                        "startDate": "09/22/2015",
                        "startTime": "11:15:33"
                      }
                    }
                  ]
                },
                "messages": {
                  "total": 3,
                  "items": [
                    {
                      "user_name": "John Smith",
                      "image": "/images/carbone.png",
                      "text": "How was your meeting with the Bill Gates?",
                      "link": "/message.php#/1",
                      "created_at": "8:00 PM"
                    },
                    {
                      "user_name": "John Smith",
                      "image": "/images/carbone.png",
                      "text": "How was your meeting with the Bill Gates?",
                      "link": "/message.php#/1",
                      "created_at": "10:46 PM"
                    },
                    {
                      "user_name": "John Smith",
                      "image": "/images/carbone.png",
                      "text": "How was your meeting with the Bill Gates?",
                      "link": "/message.php#/1",
                      "created_at": "1:15 PM"
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
