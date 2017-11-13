'use strict';
/**
* dmc.common.header Module
*
* Global Header
*/
// angular.module('dmc', ['angulartics', 'angulartics.google.analytics']);
angular.module('dmc.common.header', ['ngAnimate', 'dmc.model.user', 'dmc.common.notifications'])
.config(function($animateProvider) {
    $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
})
.directive('dmcTopHeader', ['$window', 'DMCUserModel', '$mdMenu', '$rootScope', 'notificationsMessages', function($window, userModel, $mdMenu, $rootScope, notificationsMessages){
  return {
    restrict: 'A',
    scope: {
      showNotification: '=',
      activePage: '=',
      membersOnly: '='
      //userData: '='
    },
    templateUrl: 'templates/common/header/header-tpl.html',
    controller : function($scope,ajax,dataFactory,$window,$mdMedia){
        $scope.userData;
        //$scope.invitations = [];
        $scope.userName = userModel.getUserName();
        userModel.getUserData().then(
            function(response){
                var data = response.data ? response.data : response;
                if (data.id) {
                    initUserData(data);
                }
            }
        );

        $scope.screenSmall = function(){
          return $mdMedia('(max-width: 900px)');
        }

        $scope.screenVerySmall = function(){
          return $mdMedia('(max-width: 710px)');
        }

        var initUserData = function(data) {
          $scope.userData = data;
          $scope.userProfileId = $scope.userData.id;
          $scope.userAccountId = $scope.userData.id;
          $scope.userCompanyId = $scope.userData.companyId;

          $scope.userData.isDmdiiAdmin = true;
          // ($scope.userData.roles && angular.isDefined($scope.userData.roles[0])) ? true : false;
          if ($scope.userData.runningServices) {
              $scope.runningServicesList = $scope.userData.runningServices.items;
              $scope.service_alert = $scope.userData.runningServices.total;
          }
          if($scope.userData.profileId !=1 ){
            // ajax.get(dataFactory.getMembersToProject(),
            //     {
            //         'profileId' : $scope.userData.profileId,
            //         'accept' : false,
            //     },
            //     function(response){
            //       $scope.invitations = response.data;
            //       $scope.message_alert = 0;
            //       for(var i in $scope.invitations){
            //         $scope.message_alert++;
            //         $scope.invitations[i].date = moment($scope.invitations[i].date).format('MM/DD/YYYY, hh:mm A');
            //         getProfile($scope.invitations[i]);
            //       }
            //
            //     }
            // )

                      if ($scope.userData.messages) {
                         for (var i=0; i<$scope.userData.messages.items.length; i++) {
                           $scope.userData.messages.items[i].link = '/all.php#/invitations';
                        }
                        $scope.messagesList = $scope.userData.messages.items;
                         $scope.message_alert = $scope.userData.messages.total;
                       }


          }


          if ($scope.userData.notifications) {
              var notification_alert = 0;

              angular.forEach($scope.userData.notifications, function(item) {
                  if (item.unread === true && !item.cleared && !item.deleted){
                      notification_alert++;
                  }
              });
              notificationsMessages.setNotificationAlerts(notification_alert);
              notificationsMessages.setNotifications($scope.userData.notifications);
          }
            apply();
        };

        $scope.getAlertCount = function(){
          return notificationsMessages.getNotificationAlerts();
        };

        $scope.getNotifications = function(){
          return notificationsMessages.getNotifications();
        }


        // var getProfile = function(invitation){
        //   ajax.get(dataFactory.profiles(invitation.fromProfileId).get,{},
        //     function(response){
        //       invitation['profileImage'] = response.data.image;
        //     }
        //   );
        // }
// =======
//         $scope.$watch(function () { return notificationsMessages.getNotificationAlerts(); }, function (newValue, oldValue) {
//           if (newValue != null) {
//             $scope.notification_alert = newValue;
//           }
//         }, true);
// >>>>>>> master

        $scope.setDropDown = function(event,width){
            width = $(event.currentTarget).width()+12;
        };

        $scope.login = function(){
          userModel.login();
        };

        $scope.logout = function(){
          ajax.get(dataFactory.logoutUrl(),{},function(resp){
            userModel.logout();
            $window.location.href=$window.location.origin;
          });
        };

        $scope.closeMenu = function(){
          $mdMenu.cancel();
        };

        function markRead(callback){
            var user = $.extend(true,{},$scope.userData);
            for(var i in user.notifications){
                user.notifications[i].read = true;
            }
            ajax.update(dataFactory.markReadNotifications(),user,callback);
        }

        $scope.markAllRead = function(){
            ajax.get(dataFactory.markAllNotificationsRead($scope.userData.id), {}, function() {
                for(var i in $scope.userData.notifications){
                  $scope.userData.notifications[i].unread = false;
                }
                notificationsMessages.setNotificationAlerts(0);
                notificationsMessages.setNotifications($scope.userData.notifications);
            });
        };

        $scope.viewAll = function(){
            markRead(function(){
                location.href = '/notifications.php#/user';
            });
        };

        $scope.clearNotification = function(item,ev){
            ev.preventDefault();
            for(var i in $scope.userData.notifications){
                if($scope.userData.notifications[i].id == item.id) {
                  if($scope.userData.notifications[i].unread){
                    notificationsMessages.setNotificationAlerts(notificationsMessages.getNotificationAlerts()-1);
                    $scope.userData.notifications[i].unread = false;
                  }
                }
            }
            notificationsMessages.setNotifications($scope.userData.notifications);
            ajax.get(dataFactory.markNotificationRead(item.createdFor.id, item.id),function(response){
            });
        };

        // $scope.clearNotification = function(id, notification_id){
        //     for(var i in $scope.userData.notifications){
        //         if($scope.userData.notifications[i].id == notification_id) {
        //           $scope.userData.notifications[i].unread = false;
        //           $scope.userData.notifications[i].cleared = true;
        //           notificationsMessages.setNotificationAlerts(notificationsMessages.getNotificationAlerts() - 1);
        //         }
        //     }
        //     ajax.get(dataFactory.markNotificationRead(id, notification_id),function(response){
        //     });
        // };

        $scope.$on('notificationCleared', function (event, notificationId) {
          notificationsMessages.setNotificationAlerts(notificationsMessages.getNotificationAlerts()-1);
        });

        function apply() {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }

        $scope.bannerMessage = angular.element('#bannerMsg')[0].innerText;
        $scope.showBanner = $scope.bannerMessage && $scope.bannerMessage != '_';

        $scope.searchFilters = [
            {
                id : 1, name: 'Organizations'
            },
            {
                id : 2, name: 'Individuals'
            },
            {
                id : 3, name: 'Workspaces'
            }
        ];

        $scope.submitSearch = function(text, filter){
          if ($scope.searchFilters[filter].name == 'Organizations'){
              $window.location.href='/search-v2.php#/companies'+(text ? '?text='+text : '');
          }
          else if ($scope.searchFilters[filter].name == 'Individuals'){
              $window.location.href='/search-v2.php#/members'+(text ? '?text='+text : '');
          }
          else if ($scope.searchFilters[filter].name == 'Workspaces'){
              $window.location.href='/all-projects.php#/'+(text ? '?text='+text : '');
          }
        }

    }
  };
}]);
