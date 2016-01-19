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
			controller: 'notificationsPmController'
		})
		.state('notifications-user', {
			url: '/user',
			templateUrl: 'templates/notifications/notifications.html',
			controller: 'notificationsUserController'
		});
		$urlRouterProvider.otherwise('/pm');
	})
	.controller('notificationsPmController', ['$scope', function ($scope) {
		$scope.user = false;
		$scope.filterFlag = false;


		$scope.notifications = {
			"Projects Created":{
				today: 4,
				week: 6,
				month: 9
			},
			"Services Completed":{
				today: 5,
				week: 8,
				month: 8
			},
			"Assigned Tasks":{
				today: 5,
				week: 6,
				month: 10
			},
			"Added as Contact":{
				today: 3,
				week: 6,
				month: 12
			},
			"Reviewed":{
				today: 10,
				week: 10,
				month: 11
			},
		}

		$scope.notificationsData = [
//created
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/17/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/16/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/11/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/10/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/11/2016 12:00:00"
			},
//completed
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/18/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/17/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/16/2016 12:00:00"
			},
//task 
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/18/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/11/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/09/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/10/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/12/2016 12:00:00"
			},
//contact
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/09/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/17/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/18/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/16/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/10/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/07/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/08/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/04/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/07/2016 12:00:00"
			},
//reviwed
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/09/2016 12:00:00"
			},
		]

		$scope.today = [
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				time: "2 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				time: "3 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				time: "4 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Filler Product has 2 new ratings.",
				linkTitle: "View all Filler Product ratings.",
				link: "",
				time: "5 hours ago",
			},
		];

		$scope.yesterday = [
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				time: "2 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				time: "3 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				time: "4 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Filler Product has 2 new ratings.",
				linkTitle: "View all Filler Product ratings.",
				link: "",
				time: "5 hours ago",
			},
		];

		$scope.filtered = function(time, type){
			$scope.filterFlag = true;
			$scope.filterBy = function(val){
				var day, month, nowDay=19, nowMonth=1;
				day = val.date.split(' ');
				day = val.date.split('/');
				month = day[0];
				day = day[1];

				if(type != val.type){
					return false;
				}
				switch(time){
					case "today": if(day == nowDay && month == nowMonth) return true; else return false; 
					case "week": if(nowDay-day<7 && month == nowMonth) return true; else return false; 
					case "month": if(month == nowMonth) return true; else return false; 
					case "all": return true; 
				}
			}
		}
	}])
	.controller('notificationsUserController', ['$scope', function ($scope) {
		$scope.user = true;
		$scope.filterFlag = false;


		$scope.notifications = {
			"Projects Created":{
				today: 4,
				week: 6,
				month: 9
			},
			"Services Completed":{
				today: 5,
				week: 8,
				month: 8
			},
			"Assigned Tasks":{
				today: 5,
				week: 6,
				month: 10
			},
			"Added as Contact":{
				today: 3,
				week: 6,
				month: 12
			},
			"Reviewed":{
				today: 10,
				week: 10,
				month: 11
			},
		}

		$scope.notificationsData = [
//created
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/17/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/16/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/11/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/10/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith created project.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Projects Created",
				date: "01/11/2016 12:00:00"
			},
//completed
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/18/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/17/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				type: "Services Completed",
				date: "01/16/2016 12:00:00"
			},
//task 
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/18/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/11/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/09/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/10/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has assigned you task.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Assigned Tasks",
				date: "01/12/2016 12:00:00"
			},
//contact
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/09/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/17/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/18/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/16/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/10/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/07/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/08/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/04/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				type: "Added as Contact",
				date: "01/07/2016 12:00:00"
			},
//reviwed
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/19/2016 12:00:00"
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				type: "Reviewed",
				date: "01/09/2016 12:00:00"
			},
		]

		$scope.today = [
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				time: "2 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				time: "3 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				time: "4 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Filler Product has 2 new ratings.",
				linkTitle: "View all Filler Product ratings.",
				link: "",
				time: "5 hours ago",
			},
		];

		$scope.yesterday = [
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has followed you.",
				linkTitle: "View John Smith's profile.",
				link: "",
				time: "2 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "John Smith has reviwed your performance for The Filler Project.",
				linkTitle: "Check out your review.",
				link: "",
				time: "3 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Service 3 has finished running.",
				linkTitle: "View the results of Service 3.",
				link: "",
				time: "4 hours ago",
			},
			{
				image: "/uploads/profile/1/20151222084711000000.jpg",
				title: "Filler Product has 2 new ratings.",
				linkTitle: "View all Filler Product ratings.",
				link: "",
				time: "5 hours ago",
			},
		];

		$scope.filtered = function(time, type){
			$scope.filterFlag = true;
			$scope.filterBy = function(val){
				var day, month, nowDay=19, nowMonth=1;
				day = val.date.split(' ');
				day = val.date.split('/');
				month = day[0];
				day = day[1];

				if(type != val.type){
					return false;
				}
				switch(time){
					case "today": if(day == nowDay && month == nowMonth) return true; else return false; 
					case "week": if(nowDay-day<7 && month == nowMonth) return true; else return false; 
					case "month": if(month == nowMonth) return true; else return false; 
					case "all": return true; 
				}
			}
		}
	}]);
