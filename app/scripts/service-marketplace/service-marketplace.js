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
    'dmc.model.question-toast-model',
    'dmc.widgets.tabs',
    'dmc.component.treemenu',
    'dmc.component.productcard',
    'dmc.component.members-card',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.component.carousel',
    'dmc.model.dome',
    'dmc.model.toast-model',
    'dmc.widgets.uploadModal',
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
        '$q',
        '$http',
        'domeModel',
        '$rootScope',
        function (ajax,
                  dataFactory,
                  $stateParams,
                  toastModel,
                  $q,
                  $http,
                  domeModel,
                  $rootScope) {
            this.get_service = function(id){
                var promises = {
                    "service": $http.get(dataFactory.services(id).get),
                    "specifications": $http.get(dataFactory.services(id).get_specifications),
                    "service_authors": $http.get(dataFactory.services(id).get_authors),
                    "service_input_output": $http.get(dataFactory.services(id).get_inputs_outputs),
                    "service_tags": $http.get(dataFactory.services(id).get_tags),
                    "services_statistic": $http.get(dataFactory.services(id).get_statistics),
                    "service_reviews": $http.get(dataFactory.services(id).reviews),
                    "service_images": $http.get(dataFactory.services(id).get_images),
                    "interface": $http.get(dataFactory.services(id).get_interface)
                };

                var extractData = function(response){
                    return response.data ? response.data : response;
                };

                return $q.all(promises).then(function(responses){
                        var service = extractData(responses.service);
                        console.log(service);
                        service.interface = (responses.interface.data && responses.interface.data.length > 0 ? responses.interface.data[0] : null);
                        if(service.interface){
                            domeModel.getModel(service.interface,function(response){
                                service.interfaceModel = response.data.pkg;
                                console.log(service.interfaceModel);
                            });
                        }
                        service.specifications = extractData(responses.specifications);
                        service.service_authors = extractData(responses.service_authors);
                        service.service_input_output = extractData(responses.service_input_output);
                        service.service_tags = extractData(responses.service_tags);
                        service.services_statistic = extractData(responses.services_statistic);
                        service.service_reviews = extractData(responses.service_reviews);
                        service.service_images = extractData(responses.service_images);

                        service.rating = service.service_reviews.map(function(value, index){
                            return value.rating;
                        });
                        service.number_of_comments = service.service_reviews.length;

                        service.precentage_stars = [0, 0, 0, 0, 0];
                        service.average_rating = 0;
                        if(service.number_of_comments != 0) {
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
                );
            };

            this.get_all_service = function(params, callback){
                return ajax.get(dataFactory.services($stateParams.serviceId).all, params,
                    function(response){
                        callback(response.data);
                    }
                )
            };

            var get_reply = function(review){
                ajax.get(dataFactory.services(review.id).getReply,
                    {
                        '_order': "DESC",
                        '_sort': "date"
                    },
                    function(response){
                        for(var i in response.data){
                            response.data[i].date = moment(response.data[i].date).format("MM/DD/YYYY hh:mm A");
                            get_helpful(response.data[i]);
                            get_flagged(response.data[i]);
                        }
                        review['replyReviews'] = response.data;
                    }
                )
            };

            var get_helpful = function(review){
                ajax.get(dataFactory.services(review.id).getHelpful,
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
                ajax.get(dataFactory.services(review.id).getFlagged,
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
                ajax.create(dataFactory.services().addFlagged,
                    {
                        'reviewId': reviewId,
                        'accountId': $rootScope.userData.accountId
                    },
                    function(response){}
                )
            };

            this.get_service_reviews = function(params, callback){
                return ajax.get(dataFactory.services($stateParams.serviceId).reviews,
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
                        params["status"] = true;
                        params["date"] = moment().format('x');
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

            this.update_service_reviews = function(id, params, callback){
                ajax.get(dataFactory.services(id).get_review,
                    {},
                    function(response){
                        var review= response.data;
                        if(params.reply){
                            review.reply = params.reply;
                        }else{
                            review.like = params.like;
                            review.dislike = params.dislike;
                        }

                        ajax.update(dataFactory.services(id).update_review,
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
                return ajax.create(dataFactory.services($stateParams.serviceId).addHelpful,
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
                ajax.update(dataFactory.services(id).updateHelpful,
                    helpful,
                    function(response){}
                )
            };



            this.edit_service = function(params, callback){
                ajax.update(dataFactory.services( params["specification"].id).edit_specifications,
                    params["specification"],
                    function(response){
                    }
                )
                ajax.get(dataFactory.services($stateParams.serviceId).get,
                    {},
                    function(response){
                        var component = response.data;
                        component['title'] = params['title'];
                        component['description'] = params['description'];
                        component['serviceType'] = params['serviceType'];

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

            this.add_services_images = function(array){
                ajax.get(dataFactory.services($stateParams.serviceId).get_images,
                    {
                        "_limit" : 1,
                        "_order" : "DESC",
                        "_sort" : "id"
                    },
                    function(response){
                        var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1);
                        for(var i in array){
                            ajax.create(dataFactory.services($stateParams.serviceId).add_images,
                                {
                                    "id": lastId,
                                    "serviceId": $stateParams.serviceId,
                                    "url": array[i]
                                },
                                function(response){}
                            );
                            lastId++;
                        }
                    }
                )
            };

            this.remove_services_images = function(array){
                for(var i in array){
                    ajax.delete(dataFactory.services(array[i]).remove_images, {},
                        function(response){}
                    )
                }
            }

            this.get_service_hystory = function(params, callback){
                return ajax.get(dataFactory.services($stateParams.serviceId).get_history,
                    params,
                    function(response){
                        callback(response.data)
                    }
                )
            };

            this.get_array_specifications = function(callback){
                return ajax.get(dataFactory.services($stateParams.serviceId).get_array_specifications,
                    {},
                    function(response){
                        callback(response.data)
                    }
                )
            }

            this.add_array_specifications = function(name, callback){
                ajax.get(dataFactory.services($stateParams.serviceId).get_array_specifications,
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

        }
    ]
);