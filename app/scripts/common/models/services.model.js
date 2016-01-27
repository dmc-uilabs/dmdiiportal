'use strict';

angular.module('dmc.model.services', [
	'dmc.data',
	'dmc.model.toast-model'
])
.service('DMCServicesModel', ['$http', 'dataFactory', '$q', 'toastModel', function($http, dataFactory, $q, toastModel) {
	var deffered = $q.defer();

	this.create  = function(params) {
		$http({
			method: "GET",
			url: dataFactory.getService(),
			params: {
				"_limit" : 1,
				"_order" : "DESC",
				"_sort" : "id"
			}
		}).then(
			function(response){
				var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1);
				$http(
				{
					method: 'POST', 
					url: dataFactory.getService(),
					data: {
						"id": lastId,
						"title": params.title,
						"description": params.description,
						"owner": "M.Dawson",
						"releaseDate": "25/08/2015",
						"serviceType": "analytical",
						"tags": params.tags,
						"specifications": "/services/3/specifications",
						"featureImage": {
							"thumbnail": "images/marketplace-card-image-1.jpg",
							"large": "images/marketplace-card-image-1.jpg"
						},
						"currentStatus": {
							"percentCompleted": 0,
							"startDate": "20/09/2015",
							"startTime": "11:15:33",
							"project": {
								"id": params.pojectId,
								"title": params.pojectTitle
							}
						},
						"projectId": params.pojectId,
						"from": params.from           
					}
				}
				).then(function(response){
					toastModel.showToast("success", "Service Was Created");
					deffered.resolve(lastId);
				})
			},
			function(){
				toastModel.showToast("error", "Fail Create Server");
				deffered.reject();
			}
		)
		return deffered.promise;
	}

	this.list  = function() {
		$http({
			method: "GET",
			url: dataFactory.getService(),
			params: {
				"_order" : "DESC",
				"_sort" : "title"
			}
		}).then(function(response){
			var result = []
			for(var i in response.data){
				result.push({
					id: response.data[i].id,
					title: response.data[i].title
				})
			}
			deffered.resolve(result);
		},
		function(){
			toastModel.showToast("error", "Fail Get All Services");
			deffered.reject();
		}
		)
		return deffered.promise;
	}

	this.favorite = function(id){
		$http({
			method: "GET",
			url: dataFactory.getFavoriteService(id),
			params: {
				"_order" : "DESC",
				"_sort" : "id"
			}
		}).then(function(response){
			var favorite = []
			for(var i in response.data){
				$http({
					method: "GET",
					url: dataFactory.getService()+ response.data[i].productId,
					params: {}
				}).then(function(response){
					favorite.push(response.data);
				})
			}
			deffered.resolve(favorite, favorite.length);
		},
		function(){
			toastModel.showToast("error", "Fail Get Favorites Services");
			deffered.reject();
		}
		)
		return deffered.promise;
	}
}]);