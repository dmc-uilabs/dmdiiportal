'use strict';
angular.module('dmc.account')
    .controller('NotificationsAccountCtr', [
        '$stateParams',
        '$state',
        '$scope',
        'accountData',
        'ajax',
        'dataFactory',
        'questionToastModel',
        function ($stateParams,
                  $state,
                  $scope,
                  accountData,
                  ajax,
                  dataFactory,
                  questionToastModel) {
            $scope.accountData = accountData;
            $scope.accountId = $stateParams.accountId;
            $scope.page = $state.current.name.split('.')[1];
            $scope.title = pageTitles[$scope.page];

            // disable all notification for one section (website, email)
            $scope.disableAll = function(type){
                for(var k in $scope.notifications) {
                    for (var i in $scope.notifications[k].data) {
                        for (var j in $scope.notifications[k].data[i]['account-notification-category-items']) {
                            if(type == $scope.notifications[k].data[i]['account-notification-category-items'][j].user_item.section && $scope.notifications[k].data[i]['account-notification-category-items'][j].user_item.changedSelected == true) {
                                $scope.notifications[k].data[i]['account-notification-category-items'][j].user_item.changedSelected = false;
                                $scope.changedNotification($scope.notifications[k].data[i]['account-notification-category-items'][j].user_item);
                            }
                        }
                    }
                }
            };

            // enable all notifications for one section (website, email)
            $scope.enableAll = function(type){
                for(var k in $scope.notifications) {
                    for (var i in $scope.notifications[k].data) {
                        for (var j in $scope.notifications[k].data[i]['account-notification-category-items']) {
                            if(type == $scope.notifications[k].data[i]['account-notification-category-items'][j].user_item.section && $scope.notifications[k].data[i]['account-notification-category-items'][j].user_item.changedSelected == false) {
                                $scope.notifications[k].data[i]['account-notification-category-items'][j].user_item.changedSelected = true;
                                $scope.changedNotification($scope.notifications[k].data[i]['account-notification-category-items'][j].user_item);
                            }
                        }
                    }
                }
            };

            $scope.notificationCategories = [];
            // get all notification categories
            $scope.getNotifications = function(){
                ajax.get(dataFactory.getAccountNotifications(),{
                        _sort : 'position',
                        _order : 'ASC'
                    }, function(response){
                        $scope.notificationCategories = response.data;
                        ajax.get(dataFactory.getAccountNotificationCategoryItems(),{},function(res){
                            for(var i in res.data){
                                for(var j in $scope.notificationCategories){
                                    if(res.data[i]['account-notification-categoryId'] == $scope.notificationCategories[j].id) {
                                        if (!$scope.notificationCategories[j]['account-notification-category-items']) $scope.notificationCategories[j]['account-notification-category-items'] = [];
                                        $scope.notificationCategories[j]['account-notification-category-items'].push(res.data[i]);
                                    }
                                }
                            }
                            $scope.getUserNotifications();
                        });
                    }
                );
            };
            //TODO uncomment when implemented or fixed
            //$scope.getNotifications();

            // get notifications for current account
            $scope.getUserNotifications = function(){
                ajax.get(dataFactory.getUserAccountNotifications($scope.accountId),{}, function(response){
                        $scope.notifications = {};
                        for(var k in response.data){
                            if(!$scope.notifications[response.data[k].section]){
                                $scope.notifications[response.data[k].section] = {};
                                $scope.notifications[response.data[k].section].title = response.data[k].section;
                                $scope.notifications[response.data[k].section].data = $.extend(true,{},$scope.notificationCategories);
                            }
                        }
                        for(var k in $scope.notifications) {
                            for (var i in $scope.notifications[k].data) {
                                for (var j in $scope.notifications[k].data[i]['account-notification-category-items']) {
                                    for(var d in response.data){
                                        if(k == response.data[d].section && response.data[d]['account-notification-category-itemId'] == $scope.notifications[k].data[i]['account-notification-category-items'][j].id){
                                            $scope.notifications[k].data[i]['account-notification-category-items'][j].user_item = response.data[d];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                );
            };

            $scope.changedItems = [];
            // function for catch changes
            $scope.changedNotification = function(item){
                var exist = false;
                console.log(item);
                console.log($scope.changedItems);
                for(var i in $scope.changedItems) {
                    if($scope.changedItems[i].id == item.id) {
                        if(item.selected == item.changedSelected){
                            $scope.changedItems.splice(i,1);
                            exist = true;
                            break;
                        }else {
                            exist = true;
                            break;
                        }
                    }
                }
                if(!exist){
                    $scope.changedItems.push(item);
                }
                apply();
            };

            $scope.switchByText = function(item){
                item.changedSelected =! item.changedSelected;
                $scope.changedNotification(item);
            };

            // cancel changes
            $scope.cancelChanges = function(){
                for(var i in $scope.changedItems){
                    $scope.changedItems[i].changedSelected = $scope.changedItems[i].selected;
                }
                $scope.changedItems = [];
                apply();
            };

            // save changes
            $scope.saveChanges = function(){
                if($scope.changedItems.length > 0){
                    for(var i in $scope.changedItems) {
                        ajax.update(dataFactory.updateUserAccountNotification($scope.changedItems[i].id), {
                            selected : $scope.changedItems[i].changedSelected
                        }, function (response) {
                            for(var j in $scope.changedItems){
                                if($scope.changedItems[j].id == response.data.id){
                                    $scope.changedItems.splice(j,1);
                                    break;
                                }
                            }
                            apply();
                        });
                    }
                }
            };

            $scope.$on('$locationChangeStart', function (event, next, current) {
                if ($scope.changedItems.length > 0 && current.match('\/notifications')) {
                    event.preventDefault();
                    questionToastModel.show({
                        question: 'Are you sure you want to leave this page without saving?',
                        buttons: {
                            ok: function(){
                                $scope.changedItems = [];
                                window.location = next;
                                $scope.$apply();
                            },
                            cancel: function(){}
                        }
                    }, event);
                }
            });

            $(window).unbind('beforeunload');
            $(window).bind('beforeunload', function(){
                if($scope.changedItems.length > 0) return '';
            });


            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };
        }]);
