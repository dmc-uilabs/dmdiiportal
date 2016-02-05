'use strict';

angular.module('dmc.notifications', [
	'dmc.configs.ngmaterial',
	'ngMdIcons',
	'ui.router',
	'dmc.ajax',
	'dmc.data',
	'dmc.common.header',
	'dmc.common.footer'
])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
		$stateProvider.state('notifications-pm', {
			url: '/pm',
			templateUrl: 'templates/notifications/notifications.html',
			controller: 'notificationsPmController',
			resolve: {
				notificationsStatistic: ['notificationsModel', function(notificationsModel){
					return notificationsModel.get_notifications_statistic();
				}]
			}
		})
		.state('notifications-user', {
			url: '/user',
			templateUrl: 'templates/notifications/notifications.html',
			controller: 'notificationsUserController',
			resolve: {
				notificationsStatistic: ['notificationsModel', function(notificationsModel){
					return notificationsModel.get_notifications_statistic();
				}]
			}
		});
		$urlRouterProvider.otherwise('/pm');
	})
	.service('notificationsModel', ['ajax', 'dataFactory', 'toastModel',
                            function (ajax, dataFactory, toastModel) {
        this.get_notifications = function(params, callback){
            return ajax.get(dataFactory.getNotifications(),
                params,
                function(response){
                    callback(response.data);
                }
            )
        };

        this.get_notifications_statistic = function(callback, params){
            return ajax.get(dataFactory.getNotificationsStatistic(),
                {},
                function(response){
                    return response.data;
                }
            )
        };
    }]);
