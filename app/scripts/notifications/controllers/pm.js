'use strict';

angular.module('dmc.notifications')
    .controller('notificationsPmController', [
        '$scope',
        'ajax',
        'notificationsStatistic',
        'notificationsModel',
        'notficationsMessages',
        'DMCUserModel',
        function ($scope,
                  ajax,
                  notificationsStatistic,
                  notificationsModel,
                  notficationsMessages,
                  DMCUserModel) {
            $scope.user = false;
            $scope.filterFlag = false;
            $scope.typeNotifications = "Today";
            $scope.userData = DMCUserModel.getUserData();
            $scope.userData.then(function(res){
                $scope.userData = res;
            });

            $scope.notifications = notificationsStatistic;

            $scope.notificationsData = [];
            notificationsModel.get_notifications_pm(
                {
                    "period": "today"
                },
                function(data){
                    for(var i in data){
                        data[i].date = moment(data[i].date).format("MM/DD/YYYY hh:mm A")
                    }
                    $scope.notificationsData = data;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            )

            $scope.getItemDetails = function(item) {
                return notficationsMessages.getLinkDetails(item);
            };

            $scope.reset = function() {
                $scope.typeNotifications = "Today";
                $scope.filterFlag = false;
                notificationsModel.get_notifications_pm(
                    {
                        "period": "today"
                    },
                    function(data){
                        for(var i in data){
                            data[i].date = moment(data[i].date).format("MM/DD/YYYY hh:mm A")
                        }
                        $scope.notificationsData = data;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }
                )
            }

            $scope.filtered = function(time, events, name){
                var period = "";
                if(time == "today"){
                    period = "today";
                }else if (time == "week"){
                    period = ["today","week"];
                }else{
                    period = ["today","week","month"];
                }
                notificationsModel.get_notifications_pm(
                    {
                        "period": period,
                        "event": events
                    },
                    function(data){
                        for(var i in data){
                            data[i].date = moment(data[i].date).format("MM/DD/YYYY hh:mm A")
                        }
                        $scope.notificationsData = data;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }
                )
                $scope.typeNotifications = name
                $scope.filterFlag = true;
            }
        }]);