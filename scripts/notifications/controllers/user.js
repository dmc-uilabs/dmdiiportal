'use strict';

angular.module('dmc.notifications')
    .controller('notificationsUserController', [
        '$scope',
        'ajax',
        'dataFactory',
        'notificationsStatistic',
        'notificationsModel',
        'notificationsMessages',
        'DMCUserModel',
        function ($scope,
                  ajax,
                  dataFactory,
                  notificationsStatistic,
                  notificationsModel,
                  notificationsMessages,
                  DMCUserModel) {
            $scope.user = true;
            $scope.filterFlag = false;
            $scope.typeNotifications = 'Today';
            $scope.userData = DMCUserModel.getUserData();
            $scope.userData.then(function(res){
                $scope.userData = res;
            });

            //$scope.notificationList = $scope.userData.notifications;

            $scope.currentPage = 1;

            $scope.changePage = function(id){
              $scope.currentPage = id;
            }

            $scope.pages = [
              {
                  id : 1,
                  title : 'Unread'
              },
              {
                  id : 2,
                  title : 'All'
              }
            ];

            $scope.notifications = notificationsStatistic;

            $scope.notificationsData = [];

            // notificationsModel.get_notifications_user(
            //     {
            //         'period': 'today'
            //     },
            //     function(data){
            //         for(var i in data){
            //             data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A')
            //         }
            //         $scope.notificationsData = data;
            //         if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            //     }
            // )

            $scope.getItemDetails = function(item) {
                return notificationsMessages.getLinkDetails(item);
            }

            $scope.getNotifications = function(){
              $scope.userData.notifications = notificationsMessages.getNotifications();
              return $scope.userData.notifications;
            }

            $scope.clearNotification = function(id, notification_id){
                for(var i in $scope.userData.notifications){
                    if($scope.userData.notifications[i].id == notification_id) {
                      $scope.userData.notifications[i].unread = false;
                      notificationsMessages.setNotificationAlerts(notificationsMessages.getNotificationAlerts() - 1);
                    }
                }
                notificationsMessages.setNotifications($scope.userData.notifications);
                ajax.get(dataFactory.markNotificationRead(id, notification_id),function(response){
                });
            };


            $scope.reset = function() {
                $scope.typeNotifications = 'Today';
                $scope.filterFlag = false;
                notificationsModel.get_notifications_user(
                    {
                        'period': 'today'
                    },
                    function(data){
                        for(var i in data){
                            data[i].date = moment().format('MM/DD/YYYY hh:mm A')
                        }
                        $scope.notificationsData = data;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }
                )
            }

            $scope.filtered = function(time, events, name){
                var period = '';
                if(time == 'today'){
                    period = 'today';
                }else if (time == 'week'){
                    period = ['today','week'];
                }else{
                    period = ['today','week','month'];
                }
                notificationsModel.get_notifications_user(
                    {
                        'period': period,
                        'event': events
                    },
                    function(data){
                        for(var i in data){
                            data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A')
                        }
                        $scope.notificationsData = data;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }
                )
                $scope.typeNotifications = name
                $scope.filterFlag = true;
            }
        }]);
