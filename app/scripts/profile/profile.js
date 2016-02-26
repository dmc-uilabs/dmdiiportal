'use strict';

angular.module('dmc.profile', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngtimeago',
    'ui.router',
    'ngCookies',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'dmc.widgets.stars',
    'dmc.widgets.review',
    'dmc.widgets.tabs',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.location',
    'dmc.model.toast-model',
    'dmc.model.fileUpload',
    'dmc.model.question-toast-model',
    'dmc.model.profile',
    'dmc.model.previous-page',
    'flow'
])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('profile', {
                url: '/:profileId',
                templateUrl: 'templates/profile/profile.html',
                controller: 'profileController',
                resolve: {
                    profileData: ['profileModel', '$stateParams', function (profileModel, $stateParams) {
                        console.info("model");
                        return profileModel.get_profile($stateParams.profileId);
                    }]
                }
            })
            .state('edit',{
                url: '/:profileId/edit',
                templateUrl: 'templates/profile/edit.html',
                controller: 'profileEditController',
                resolve: {
                    profileData: ['profileModel', '$stateParams', function (profileModel, $stateParams) {
                        return profileModel.get_profile($stateParams.profileId);
                    }]
                }
            });
        $urlRouterProvider.otherwise('/1');
    })
    .service('profileModel', ['ajax', '$q','$http','dataFactory', '$stateParams', 'toastModel', '$rootScope',
                            function (ajax,$q,$http, dataFactory, $stateParams, toastModel, $rootScope) {
        this.get_profile = function(id){
            var promises = {
                "profile": $http.get(dataFactory.profiles(id).get),
                "profile_reviews": $http.get(dataFactory.profiles(id).reviews)
            };

            var extractData = function(response){
                return response.data ? response.data : response;
            };

            return $q.all(promises).then(function(responses) {
                var profile = extractData(responses.profile);
                profile.profile_reviews = extractData(responses.profile_reviews);
                profile.rating = profile.profile_reviews.map(function(value, index){
                    return value.rating;
                });
                profile.number_of_comments = profile.profile_reviews.length;

                if(profile.number_of_comments != 0) {
                    profile.precentage_stars = [0, 0, 0, 0, 0];
                    profile.average_rating = 0;
                    for (var i in profile.rating) {
                        profile.precentage_stars[profile.rating[i] - 1] += 100 / profile.number_of_comments;
                        profile.average_rating += profile.rating[i];
                    }
                    profile.average_rating = (profile.average_rating / profile.number_of_comments).toFixed(1);

                    for (var i in profile.precentage_stars) {
                        profile.precentage_stars[i] = Math.round(profile.precentage_stars[i]);
                    }
                }
                return profile;
            },function(response){
                toastModel.showToast("error", "Error." + response.statusText);
            });

        }

        var get_reply = function(review){
            ajax.get(dataFactory.profiles(review.id).getReply,
                {
                    '_order': "DESC",
                    '_sort': "date"
                },
                function(response){
                    for(var i in response.data){
                        response.data[i].date = moment(response.data[i].date).format("MM/DD/YYYY hh:mm a");
                        get_helpful(response.data[i]);
                    }                        
                    review['replyReviews'] = response.data;
                }
            )
        }
        var get_helpful = function(review){
            ajax.get(dataFactory.profiles(review.id).getHelpful,
                {
                    'reviewId': review.id,
                    'accountId': $rootScope.userData.accountId
                },
                function(response){
                    review['helpful'] = response.data[0];
                }
            )
        }

        this.get_profile_reviews = function(id, params, callback){
            return ajax.get(dataFactory.profiles(id).reviews,
                params,
                function(response){
                    for(var i in response.data){
                        response.data[i].date = moment(response.data[i].date).format("MM/DD/YYYY hh:mm a");
                        get_helpful(response.data[i]);
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
        }

        this.add_profile_reviews = function(id, params, callback){
            ajax.get(dataFactory.profiles(id).addReviews, 
                {
                    "_limit" : 1,
                    "_order" : "DESC",
                    "_sort" : "id"
                }, 
                function(response){  
                    var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1); 
                    params["id"] = lastId;
                    params["profileId"] = id;
                    params["reply"] = false;
                    params["status"] = true;
                    params["date"] = moment().format('x');
                    params["like"] = 0;
                    params["dislike"] = 0;

                    return ajax.create(dataFactory.profiles(id).addReviews,
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

        this.update_profile_reviews = function(id, params, callback){
            ajax.get(dataFactory.profiles(id).get_review,
                {},
                function(response){
                    var review= response.data;
                    if(params.reply){
                        review.reply = params.reply;
                    }else{
                        review.like = params.like;
                        review.dislike = params.dislike;
                    }

                    ajax.update(dataFactory.profiles(id).update_review,
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
            return ajax.create(dataFactory.profiles($stateParams.profileId).addHelpful,
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
            ajax.update(dataFactory.profiles(id).updateHelpful,
                helpful,
                function(response){}
            )
        };

        this.edit_profile = function(id, params, callback){
            ajax.get(dataFactory.profiles(id).get,
                {},
                function(response){
                    console.info(response.data);
                    var profile = response.data;
                    profile['description'] = params['description'];
                    profile['displayName'] = params['displayName'];
                    profile['jobTitle'] = params['jobTitle'];
                    profile['skills'] = params['skills'];
                    profile['location'] = params['location'];

                    return ajax.update(dataFactory.profiles(id).update,
                        profile,
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

        this.getProfileHistory = function(params, callback){
            return ajax.get(dataFactory.profiles($stateParams.profileId).history,
                params,
                function(response){
                    callback(response.data)
                }
            )
        };
    }])