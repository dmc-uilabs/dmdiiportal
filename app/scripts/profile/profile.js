'use strict';

angular.module('dmc.profile', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngtimeago',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'dmc.widgets.stars',
    'dmc.widgets.review',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.location',
    'dmc.model.toast-model',
    'dmc.model.fileUpload',
    'dmc.model.profile',
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
    .service('profileModel', ['ajax', 'dataFactory', '$stateParams', 'toastModel',
                            function (ajax, dataFactory, $stateParams, toastModel) {
        this.get_profile = function(id){
            return ajax.get(dataFactory.profiles(id).get,
                {
                    _embed: ["profile_reviews"]
                },
                function(response){
                    var profile = response.data;
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
                },
                function(response){
                    toastModel.showToast("error", "Error." + response.statusText);
                }
            )
        }

        this.get_profile_reviews = function(id, params, callback){
            return ajax.get(dataFactory.profiles(id).reviews,
                params,
                function(response){
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
                    params["reviewId"] = 0;
                    params["status"] = true;
                    params["date"] = moment().format('MM/DD/YYYY');
                    params["userRatingReview"] = {
                        "DMC Member": "none"
                    };
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
    }])