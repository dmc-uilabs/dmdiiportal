'use strict';

angular.module('dmc.service-marketplace', [
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
	'dmc.component.carousel',
	'dmc.model.toast-model',
   	'dmc.compare'
])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
        var resolve = {
            serviceData: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                return serviceModel.get_service($stateParams.serviceId);
            }]
        };
        $stateProvider
            .state('service-marketplace', {
                url: '/:serviceId',
                templateUrl: 'templates/service-marketplace/service-marketplace.html',
                controller: 'ServiceMarketplaceController',
                resolve: resolve
            })
            .state('service-marketplace-edit', {
                url: '/:serviceId/edit',
                templateUrl: 'templates/service-marketplace/edit.html',
                controller: 'ServiceMarketplaceEditController',
                resolve: resolve
            });
        $urlRouterProvider.otherwise('/1');
	})

    .service('serviceModel', [
        'ajax',
        'dataFactory',
        '$stateParams',
        'toastModel',
        function (ajax,
                  dataFactory,
                  $stateParams,
                  toastModel) {
            this.get_service = function(id){
                return ajax.get(dataFactory.services(id).get, {
                        "_embed": ["specifications","service_authors", "service_input_output", "service_tags", "services_statistic"]
                    },
                    function(response){
                        var service = response.data;
                        return ajax.get(dataFactory.services(id).reviews, {},
                            function(response){
                                service["service_reviews"] = response.data;
                                service.rating = service.service_reviews.map(function(value, index){
                                    return value.rating;
                                });
                                service.number_of_comments = service.service_reviews.length;

                                if(service.number_of_comments != 0) {
                                    service.precentage_stars = [0, 0, 0, 0, 0];
                                    service.average_rating = 0;
                                    for (var i in service.rating) {
                                        service.precentage_stars[service.rating[i] - 1] += 100 / service.number_of_comments;
                                        service.average_rating += service.rating[i];
                                    }
                                    service.average_rating = (service.average_rating / service.number_of_comments).toFixed(1);

                                    for (var i in service.precentage_stars) {
                                        service.precentage_stars[i] = Math.round(service.precentage_stars[i]);
                                    }
                                }
                                for(var i in service["service_reviews"]){
                                    service["service_reviews"][i]['replyReviews'] = [];
                                }
                                return service;
                            },
                            function(response){
                                toastModel.showToast("error", "Error." + response.statusText);
                            }
                        )
                    }
                )
            };

            this.get_all_service = function(params, callback){
                return ajax.get(dataFactory.services($stateParams.serviceId).all, params,
                    function(response){
                        callback(response.data);
                    }
                )
            };

            this.get_service_reviews = function(params, callback){
                return ajax.get(dataFactory.services($stateParams.serviceId).reviews,
                    params,
                    function(response){
                        callback(response.data)
                    }
                )
            };

            this.add_service_reviews = function(params, callback){
                ajax.get(dataFactory.services($stateParams.serviceId).addReviews,
                    {
                        "_limit" : 1,
                        "_order" : "DESC",
                        "_sort" : "id"
                    },
                    function(response){
                        var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1);
                        params["id"] = lastId;
                        params["productId"] = $stateParams.serviceId;
                        params["productType"] = "service";
                        params["reply"] = false;
                        params["reviewId"] = 0;
                        params["status"] = true;
                        params["date"] = moment().format('MM/DD/YYYY');
                        params["userRatingReview"] = {
                            "DMC Member": "none"
                        };
                        params["like"] = 0;
                        params["dislike"] = 0;

                        return ajax.create(dataFactory.services($stateParams.serviceId).addReviews,
                            params,
                            function(response){
                                toastModel.showToast("success", "Review added");
                                if(callback) callback(response.data)
                            },
                            function(response){
                                toastModel.showToast("error", "Error." + response.statusText);
                            }
                        )
                    }
                )
            };

            this.edit_service = function(params, callback){
                ajax.get(dataFactory.services($stateParams.serviceId).get,
                    {},
                    function(response){
                        console.info(response.data);
                        var component = response.data;
                        component['title'] = params['title'];
                        component['tags'] = params['tags'];
                        component['description'] = params['description'];

                        return ajax.update(dataFactory.services($stateParams.serviceId).update,
                            component,
                            function(response){
                                callback(response.data)
                            },
                            function(response){
                                toastModel.showToast("error", "Error." + response.statusText);
                            }
                        )
                    }
                )
            };

            this.add_services_authors = function(array){
                ajax.get(dataFactory.services($stateParams.serviceId).get_authors,
                    {
                        "_limit" : 1,
                        "_order" : "DESC",
                        "_sort" : "id"
                    },
                    function(response){
                        var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1);
                        for(var i in array){
                            ajax.create(dataFactory.services($stateParams.servicetId).add_authors,
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
                    }
                )
            };

            this.remove_services_authors = function(array){
                for(var i in array){
                    ajax.delete(dataFactory.services(array[i]).remove_authors, {},
                        function(response){}
                    )
                }
            };

            this.add_services_tags = function(array){
                ajax.get(dataFactory.services($stateParams.serviceId).get_tags,
                    {
                        "_limit" : 1,
                        "_order" : "DESC",
                        "_sort" : "id"
                    },
                    function(response){
                        var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1);
                        for(var i in array){
                            ajax.create(dataFactory.services($stateParams.serviceId).add_tags,
                                {
                                    "id": lastId,
                                    "serviceId": $stateParams.serviceId,
                                    "name": array[i]
                                },
                                function(response){}
                            );
                            lastId++;
                        }
                    }
                )
            };

            this.remove_services_tags = function(array){
                for(var i in array){
                    ajax.delete(dataFactory.services(array[i]).remove_tags, {},
                        function(response){}
                    )
                }
            };

            this.get_service_hystory = function(params, callback){
                return ajax.get(dataFactory.services($stateParams.serviceId).get_history,
                    params,
                    function(response){
                        callback(response.data)
                    }
                )
            };

    	    }
        ]
    );