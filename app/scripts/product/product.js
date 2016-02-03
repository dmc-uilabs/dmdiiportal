'use strict';

angular.module('dmc.product', [
	'dmc.configs.ngmaterial',
	'ngMdIcons',
	'ngtimeago',
	'ui.router',
	'md.data.table',
	'dmc.ajax',
	'dmc.data',
	'dmc.socket',
	'dmc.widgets.stars',
	'dmc.widgets.documents',
	'dmc.widgets.review',
	'dmc.widgets.tabs',
	'dmc.component.treemenu',
	'dmc.component.productcard',
	'dmc.component.members-card',
	'dmc.common.header',
	'dmc.common.footer',
	'dmc.model.toast-model',
	'dmc.model.services',
	'dmc.component.carousel',
   	'dmc.compare'
])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
		$stateProvider
			.state('component', {
				url: '/:typeProduct/:productId',
				templateUrl: 'templates/product/component.html',
				controller: 'componentController',
                resolve: {
                    componentData: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                        return serviceModel.get_component($stateParams.typeProduct, $stateParams.productId);
                    }]
                }
			})
            .state('edit', {
                url: '/:typeProduct/:productId/edit',
                templateUrl: 'templates/product/edit.html',
                controller: 'componentEditController',
                resolve: {
                    componentData: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                        return serviceModel.get_component($stateParams.typeProduct, $stateParams.productId);
                    }]
                }
            });
		$urlRouterProvider.otherwise('/services/1');
	})
    .service('serviceModel', ['ajax', 'dataFactory', '$stateParams', 'toastModel',
                            function (ajax, dataFactory, $stateParams, toastModel) {

        this.get_component = function(type, id){
            return ajax.get(dataFactory.components(type, id).get, {
            	"_embed": "specifications",
            },
                function(response){
                	var component = response.data;
                	return ajax.get(dataFactory.components(type, id).reviews, {},
                		function(response){
                			component["component_reviews"] = response.data;
                			component.rating = component.component_reviews.map(function(value, index){
		                        return value.rating;
		                    });
		                    component.number_of_comments = component.component_reviews.length;
		                    
		                    if(component.number_of_comments != 0) {
		                        component.precentage_stars = [0, 0, 0, 0, 0];
		                        component.average_rating = 0;
		                        for (var i in component.rating) {
		                            component.precentage_stars[component.rating[i] - 1] += 100 / component.number_of_comments;
		                            component.average_rating += component.rating[i];
		                        }
		                        component.average_rating = (component.average_rating / component.number_of_comments).toFixed(1);

		                        for (var i in component.precentage_stars) {
		                            component.precentage_stars[i] = Math.round(component.precentage_stars[i]);
		                        }
		                    }
		                    for(var i in component["component_reviews"]){
		                    	component["component_reviews"][i]['replyReviews'] = [];
		                    }
		                    return component;
                		},
		                function(response){
		                    toastModel.showToast("error", "Error." + response.statusText);
		                }
                	)
                },
                function(response){
                    toastModel.showToast("error", "Error." + response.statusText);
                }
            )
        }

        this.get_all_component = function(params, callback){
            return ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).all, params,
                function(response){
                	callback(response.data);
                },
                function(response){
                    toastModel.showToast("error", "Error." + response.statusText);
                }
            )
        }

        this.get_included_services = function(callback){
            return ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).get_included,
                {
                    "includeTo": $stateParams.productId,
                    "_expand": "service"
                },
                function(response){
                    callback(response.data);
                },
                function(response){
                    toastModel.showToast("error", "Error." + response.statusText);
                }
            )
        }

        this.add_included_services = function(array){
            ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).get_included, 
                {
                    "_limit" : 1,
                    "_order" : "DESC",
                    "_sort" : "id"
                }, 
                function(response){  
                    var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1); 
                    for(var i in array){
                        ajax.create(dataFactory.components($stateParams.typeProduct, $stateParams.productId).add_included,
                            {
                                "id": lastId,
                                "includeTo": $stateParams.productId,
                                "serviceId": array[i]
                            },
                            function(response){
                            },
                            function(response){
                                toastModel.showToast("error", "Error." + response.statusText);
                            }
                        )
                        lastId++;
                    }
                },
                function(response){
                    toastModel.showToast("error", "Error." + response.statusText);
                }
            )  
        }

        this.remove_included_services = function(array){
            for(var i in array){
                ajax.delete(dataFactory.components($stateParams.typeProduct, array[i]).remove_included,
                    {},
                    function(response){
                    },
                    function(response){
                        toastModel.showToast("error", "Error." + response.statusText);
                    }
                )
            }
        }

        this.get_component_reviews = function(params, callback){
            return ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).reviews,
                params,
                function(response){
                    callback(response.data)
                },
                function(response){
                    toastModel.showToast("error", "Error." + response.statusText);
                }
            )
        }

        this.add_component_reviews = function(params, callback){
            ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).addReviews, 
                {
                    "_limit" : 1,
                    "_order" : "DESC",
                    "_sort" : "id"
                }, 
                function(response){  
                    var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1); 
                    params["id"] = lastId;
                    params["productId"] = $stateParams.productId;
                    params["productType"] = $stateParams.typeProduct;
                    params["reply"] = false;
                    params["reviewId"] = 0;
                    params["status"] = true;
                    params["date"] = moment().format('MM/DD/YYYY');
                    params["userRatingReview"] = {
                        "DMC Member": "none"
                    };
                    params["like"] = 0;
                    params["dislike"] = 0;

                    return ajax.create(dataFactory.components($stateParams.typeProduct, $stateParams.productId).addReviews,
                        params,
                        function(response){
                            toastModel.showToast("success", "Review added");
                            if(callback) callback(response.data)
                        },
                        function(response){
                            toastModel.showToast("error", "Error." + response.statusText);
                        }
                    )
                },
                function(response){
                    toastModel.showToast("error", "Error." + response.statusText);
                }
            )  
        }

        this.edit_component = function(params, callback){
            ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).get,
                {},
                function(response){
                    console.info(response.data);
                    var component = response.data;
                    component['title'] = params['title'];
                    component['tags'] = params['tags'];
                    component['description'] = params['description'];

                    return ajax.update(dataFactory.components($stateParams.typeProduct, $stateParams.productId).update,
                        component,
                        function(response){
                            callback(response.data)
                        },
                        function(response){
                            toastModel.showToast("error", "Error." + response.statusText);
                        }
                    )
                },
                function(response){
                    toastModel.showToast("error", "Error." + response.statusText);
                }
            )
        }
    }])
.controller("ViewIncludedController", ['$scope', 'ajax', 'dataFactory', '$mdDialog', '$location', 'products', function ($scope, ajax, dataFactory, $mdDialog, $location, products) {
	$scope.products = products;
	$scope.product = null;
	$scope.product = $scope.products[0];
	$scope.index = 0;
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
	$scope.View = function(index){
		$scope.product = $scope.products[index];
		$scope.index = index;
	}
}]);
