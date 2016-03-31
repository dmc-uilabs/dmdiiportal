'use strict';
/**
* dmc.common.header Module
*
* Global Header
*/
angular.module('dmc.common.header', ['ngAnimate', 'dmc.model.user', 'dmc.common.notifications'])
.config(function($animateProvider) {
    $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
})
.directive('dmcTopHeader', ['$window', 'DMCUserModel', '$mdMenu', '$rootScope', 'notficationsMessages', function($window, userModel, $mdMenu, $rootScope, notficationsMessages){
  return {
    restrict: 'A',
    scope: {
      showNotification: '=',
      activePage: '=',
      //userData: '='
    },
    templateUrl: 'templates/common/header/header-tpl.html',
    controller : function($scope,ajax,dataFactory){
        $scope.userData;
        $scope.userName = userModel.getUserName();
        userModel.getUserData().then(
            function(response){
                var data = response.data ? response.data : response;
                if (data.accountId) {
                    initUserData(data);
                }
            }
        );

        var initUserData = function(data) {
          $scope.userData = data;
          $scope.userProfileId = $scope.userData.profileId;
          $scope.userAccountId = $scope.userData.accountId;
          $scope.userCompanyId = $scope.userData.companyId;

          $scope.runningServicesList = $scope.userData.runningServices.items;
          $scope.messagesList = $scope.userData.messages.items;
          $scope.notificationsList = getExtendedNotifications($scope.userData.notifications.items);

          $scope.service_alert = $scope.userData.runningServices.total;

          $scope.notification_alert = $scope.userData.notifications.total;
          $scope.message_alert = $scope.userData.messages.total;
            apply();
        };

        $scope.setDropDown = function(event,width){
            width = $(event.currentTarget).width()+12;
        };

        $scope.login = function(){
          userModel.login();
        };

        $scope.logout = function(){
          userModel.logout();
        };

        $scope.closeMenu = function(){
          $mdMenu.cancel();
        };

        var getExtendedNotifications = function(items) {
          var extendItems = items.map(function(item){
            return angular.extend(item, {
              'title': notficationsMessages.getLinkDetails(item).title,
              'link': notficationsMessages.getLinkDetails(item).link
            })
          })

          return extendItems;
        };

        function markRead(callback){
            var user = $.extend(true,{},$scope.userData);
            for(var i in user.notifications.items){
                user.notifications.items[i].read = true;
            }
            ajax.update(dataFactory.markReadNotifications(),user,callback);
        }

        $scope.markAllRead = function(){
            markRead(function(response){
                var data = response.data ? response.data : response;
                if (data.accountId) {
                    initUserData(data);
                }
            });
        };

        $scope.viewAll = function(){
            markRead(function(){
                location.href = '/notifications.php#/user';
            });
        };

        $scope.clearNotification = function(item,ev){
            ev.preventDefault();
            var user = $.extend(true,{},$scope.userData);
            for(var i in user.notifications.items){
                if(user.notifications.items[i].id == item.id) {
                    user.notifications.items[i].cleared = true;
                }
            }
            ajax.update(dataFactory.clearNotification(item.id),user,function(response){
                var data = response.data ? response.data : response;
                if (data.accountId) {
                    initUserData(data);
                }
            });
        };

        function apply() {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }
    }
  };
}]);
