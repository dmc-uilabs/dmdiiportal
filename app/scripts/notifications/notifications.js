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
		$urlRouterProvider.otherwise('/');
	})
	.controller('notificationsPmController', ['$scope', function ($scope) {
		$scope.user = false;
		$scope.notifications = {
			"Projects Created":{
				today: 10,
				week: 2,
				month: 3
			},
			"Services Completed":{
				today: 10,
				week: 11,
				month: 22
			},
			"Assigned Tasks":{
				today: 10,
				week: 11,
				month: 22
			},
			"Added as Contact":{
				today: 10,
				week: 2,
				month: 3
			},
			"Reviewed":{
				today: 10,
				week: 4,
				month: 5
			},
		}

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
	}])
	.controller('notificationsUserController', ['$scope', function ($scope) {
		$scope.user = true;
		$scope.notifications = {
			"Invited to Project":{
				today: 10,
				week: 2,
				month: 3
			},
			"Service Completed":{
				today: 10,
				week: 11,
				month: 22
			},
			"Assigned Tasks":{
				today: 10,
				week: 11,
				month: 22
			},
			"Added as Contact":{
				today: 10,
				week: 2,
				month: 3
			},
			"Reviewed":{
				today: 10,
				week: 4,
				month: 5
			},
		}

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
	}]);
