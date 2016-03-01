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
    .service('serviceModel', ['ajax','$q','$http', 'dataFactory', '$stateParams', 'toastModel', '$rootScope',
                            function (ajax,$q,$http, dataFactory, $stateParams, toastModel, $rootScope) {

        this.get_component = function(type, id){
            var promises = {
                "component": $http.get(dataFactory.components(type, id).get),
                "component_reviews": $http.get(dataFactory.components(type, id).reviews),
                "specifications": $http.get(dataFactory.services(id).get_specifications),
                "service_authors": $http.get(dataFactory.services(id).get_authors),
                "service_tags": $http.get(dataFactory.services(id).get_tags),
                "service_images": $http.get(dataFactory.services(id).get_images)
            };

            var extractData = function(response){
                return response.data ? response.data : response;
            };

            return $q.all(promises).then(function(responses) {
                var component = extractData(responses.component);
                component.specifications = extractData(responses.specifications);
                component.service_authors = extractData(responses.service_authors);
                component.service_tags = extractData(responses.service_tags);
                component.service_images = extractData(responses.service_images);
                component.component_reviews = extractData(responses.component_reviews);
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
                for(var i in component.component_reviews){
                    component.component_reviews[i].replyReviews = [];
                }
                return component;
            },function(response){
                toastModel.showToast("error", "Error." + response.statusText);
            });
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
                    "includeTo": $stateParams.productId
                },
                function(response){
                    var data = response.data;
                    var ids = $.map(data,function(x){ return x.serviceId; });
                    ajax.get(dataFactory.services().all,{
                        id : ids
                    },function(res){
                        for(var i in data){
                            for(var j in res.data){
                                if(data[i].serviceId == res.data[j].id){
                                    data[i].service = res.data[j];
                                    break;
                                }
                            }
                        }
                        callback(data);
                    });
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
        };

        var get_reply = function(review){
            ajax.get(dataFactory.components($stateParams.typeProduct, review.id).getReply,
                {
                    '_order': "DESC",
                    '_sort': "date"
                },
                function(response){
                    for(var i in response.data){
                        response.data[i].date = moment(response.data[i].date).format("MM/DD/YYYY hh:mm A");
                        get_helpful(response.data[i]);
                    }
                    review['replyReviews'] = response.data;
                }
            )
        };

        var get_helpful = function(review){
            ajax.get(dataFactory.components($stateParams.typeProduct, review.id).getHelpful,
                {
                    'reviewId': review.id,
                    'accountId': $rootScope.userData.accountId
                },
                function(response){
                    review['helpful'] = response.data[0];
                }
            )
        };

        var get_flagged = function(review){
            ajax.get(dataFactory.components($stateParams.typeProduct, review.id).getFlagged,
                {
                    'reviewId': review.id,
                    'accountId': $rootScope.userData.accountId
                },
                function(response){
                    if (response.data.length) {
                        review['flagged'] = true;
                    }else{
                        review['flagged'] = false;
                    };
                }
            )
        };

        this.add_flagged = function(reviewId){
            ajax.create(dataFactory.components($stateParams.typeProduct).addFlagged,
                {
                    'reviewId': reviewId,
                    'accountId': $rootScope.userData.accountId
                },
                function(response){}
            )
        };

        this.get_component_reviews = function(params, callback){
            return ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).reviews,
                params,
                function(response){
                    for(var i in response.data){
                        response.data[i].date = moment(response.data[i].date).format("MM/DD/YYYY hh:mm A");
                        get_helpful(response.data[i]);
                        get_flagged(response.data[i]);
                        if(response.data[i].reply){
                            get_reply(response.data[i]);
                        }
                    }
                    callback(response.data)
                },
                function(response){
                    toastModel.showToast("error", "Error." + response.statusText);
                }
            )
        };

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
                    params["status"] = true;
                    params["date"] = moment().format('x');
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

        this.update_component_reviews = function(id, params, callback){
            ajax.get(dataFactory.components($stateParams.typeProduct, id).get_review,
                {},
                function(response){
                    var review= response.data;
                    if(params.reply){
                        review.reply = params.reply;
                    }else{
                        review.like = params.like;
                        review.dislike = params.dislike;
                    }

                    ajax.update(dataFactory.components($stateParams.typeProduct, id).update_review,
                        review,
                        function(response){
                            if(params.reply){
                                toastModel.showToast("success", "reply added");
                            }
                            if(callback) callback(response.data)
                        }
                    )
                }
            )
        };

        this.add_helful = function(helpful, reviewId, callback){
            return ajax.create(dataFactory.components($stateParams.typeProduct, $stateParams.serviceId).addHelpful,
                {
                    accountId: $rootScope.userData.accountId,
                    reviewId: reviewId,
                    helpful: helpful
                },
                function(response){
                    callback(response.data);
                }
            )
                
            
        };

        this.update_helful = function(id, helpful){
            ajax.update(dataFactory.components($stateParams.typeProduct, id).updateHelpful,
                helpful,
                function(response){}
            )
        };

        this.edit_component = function(params, callback){
            ajax.update(dataFactory.components($stateParams.typeProduct, params["specification"].id).edit_specifications,
                params["specification"],
                function(response){
                }
            )
            ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).get,
                {},
                function(response){
                    console.info(response.data);
                    var component = response.data;
                    component['title'] = params['title'];
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

        this.add_services_tags = function(array){
            ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).get_tags, 
                {
                    "_limit" : 1,
                    "_order" : "DESC",
                    "_sort" : "id"
                }, 
                function(response){  
                    var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1); 
                    for(var i in array){
                        ajax.create(dataFactory.components($stateParams.typeProduct, $stateParams.productId).add_tags,
                            {
                                "id": lastId,
                                "serviceId": $stateParams.serviceId,
                                "name": array[i]
                            },
                            function(response){
                            },
                            function(response){
                                toastModel.showToast("error", "Error." + response.statusText);
                            }
                        )
                        lastId++;
                    }
                }
            )  
        }

        this.remove_services_tags = function(array){
            for(var i in array){
                ajax.delete(dataFactory.components($stateParams.typeProduct, array[i]).remove_tags,
                    {},
                    function(response){
                    }
                )
            }
        };

        this.remove_services_images = function(array){
            for(var i in array){
                ajax.delete(dataFactory.components($stateParams.typeProduct, array[i]).remove_images, {},
                    function(response){}
                )
            }
        }
        
        this.get_service_hystory = function(params, callback){
            return ajax.get(dataFactory.services($stateParams.productId).get_history,
                params,
                function(response){
                    callback(response.data)
                }
            )
        };

        this.get_array_specifications = function(callback){
            return ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).get_array_specifications,
                {},
                function(response){
                    callback(response.data)
                }
            )
        }

        this.add_array_specifications = function(name, callback){
            ajax.get(dataFactory.components($stateParams.typeProduct, $stateParams.productId).get_array_specifications,
                {
                    "_limit" : 1,
                    "_order" : "DESC",
                    "_sort" : "id"
                },
                function(response){
                    var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1);
                    ajax.create(dataFactory.services($stateParams.serviceId).add_array_specifications,
                        {
                            "id": lastId,
                            "name": name
                        },
                        function(response){
                            callback(response.data)
                        }
                    )
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
