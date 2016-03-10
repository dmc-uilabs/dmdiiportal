'use strict';

var currentAccountId = 1;

angular.module('dmc.company-profile', [
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
    'dmc.widgets.tabs',
	'dmc.component.members-card',
	'dmc.component.contacts-card',
	'dmc.common.header',
	'dmc.common.footer',
    'dmc.location',
	'dmc.model.toast-model',
	'dmc.model.fileUpload',
	'dmc.model.company',
    'dmc.phone-format',
    'dmc.zip-code-format',
    'dmc.model.account',
	'flow'
])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
		var resolve = {
            companyData: ['CompanyModel', '$stateParams',
                function(CompanyModel, $stateParams) {
                    return CompanyModel.getModel($stateParams.companyId);
                }
            ],
            companyReview: ['CompanyModel', '$stateParams',
                function(CompanyModel, $stateParams) {
                    return CompanyModel.getReviewModel($stateParams.profileId);
                }]
        };
        $stateProvider.state('company-profile', {
			url: '/:companyId',
			templateUrl: 'templates/company-profile/company-profile.html',
			controller: 'CompanyProfileController',
			resolve: {
                companyData: ['companyProfileModel', '$stateParams', function(companyProfileModel,$stateParams){
                    return companyProfileModel.get_company($stateParams.companyId);
                }]
            }
		}).state('company-profile-edit', {
            url: '/:companyId/edit',
            templateUrl: 'templates/company-profile/edit-company-profile.html',
            controller: 'EditCompanyProfileController',
            resolve: resolve
        }).state('company-profile-edit.overview', {
            url: '/overview'
        }).state('company-profile-edit.skills', {
            url: '/skills'
        }).state('company-profile-edit.projects', {
            url: '/projects'
        }).state('company-profile-edit.membership', {
            url: '/membership'
        }).state('company-profile-edit.contact', {
            url: '/contact'
        });

		$urlRouterProvider.otherwise('/1');

	})
    .service('companyProfileModel', ['ajax','$q','$http', 'dataFactory', '$stateParams', 'toastModel', '$rootScope',
                            function (ajax,$q,$http, dataFactory, $stateParams, toastModel, $rootScope) {
        // get company skills
        this.getSkills = function(id, callback) {
            return ajax.get(dataFactory.getCompanySkills(id),{
                    "_order" : "DESC",
                    "_sort" : "id"
                }, function(response){
                    callback(response.data);
                }
            );
        };

        // get company images
        this.getImages = function(id, callback){
            return ajax.get(dataFactory.getCompanyImages(id),{
                    "_order" : "DESC",
                    "_sort" : "id"
                }, function(response){
                    callback(response.data);
                }
            );
        };

        // get company images
        this.getSkillsImages = function(id, callback){
            return ajax.get(dataFactory.getCompanySkillsImages(id),{
                    "_order" : "DESC",
                    "_sort" : "id"
                }, function(response){
                    callback(response.data);
                }
            );
        };

        // get company videos
        this.getVideos = function(id, callback){
            return ajax.get(dataFactory.getCompanyVideos(id),{
                    "_order" : "DESC",
                    "_sort" : "id"
                }, function(response){
                    callback(response.data);
                }
            );
        };

        // get company contacts
        this.getKeyContacts = function(id, callback){
            return ajax.get(dataFactory.getCompanyKeyContacts(id),{
                    "_order" : "DESC",
                    "_sort" : "id"
                }, function(response){
                    callback(response.data);
                }
            );
        };

        // get company contacts
        this.getMembers = function(id, callback){
            ajax.get(dataFactory.getCompanyMembers(id),{},
                function(response){
                    var members = [];
                    for(var i in response.data){
                        ajax.get(dataFactory.profiles(id).get,{},
                            function(response){
                                var member = response.data;
                                ajax.get(dataFactory.getAccountFollowedMembers(member.id),{},
                                    function(response){
                                        member['follow'] = null;
                                        if(response.data.length){
                                            member['follow'] = response.data[0];
                                        }
                                        members.push(member);
                                    }
                                )
                            }
                        )
                    }
                    callback(members);
                }
            );
        };


        this.getCompanyHistory = function(params, callback){
            return ajax.get(dataFactory.companyURL($stateParams.companyId).history,
                params,
                function(response){
                    callback(response.data)
                }
            )
        };

        this.get_company = function(id){
            var promises = {
                "company": $http.get(dataFactory.companyURL(id).get),
                "company_members": $http.get(dataFactory.getCompanyMembers(id)),
                "company_reviews": $http.get(dataFactory.companyURL(id).reviews)
            };

            var extractData = function(response){
                return response.data ? response.data : response;
            };

            return $q.all(promises).then(function(responses) {
                var company = extractData(responses.company);
                company.company_members = extractData(responses.company_members);
                company.company_reviews = extractData(responses.company_reviews);
                company.rating = company.company_reviews.map(function(value, index){
                    return value.rating;
                });
                company.number_of_comments = company.company_reviews.length;

                if(company.number_of_comments != 0) {
                    company.precentage_stars = [0, 0, 0, 0, 0];
                    company.average_rating = 0;
                    for (var i in company.rating) {
                        company.precentage_stars[company.rating[i] - 1] += 100 / company.number_of_comments;
                        company.average_rating += company.rating[i];
                    }
                    company.average_rating = (company.average_rating / company.number_of_comments).toFixed(1);

                    for (var i in company.precentage_stars) {
                        company.precentage_stars[i] = Math.round(company.precentage_stars[i]);
                    }
                }
                for(var i in company.company_reviews){
                    company.company_reviews[i].replyReviews = [];
                }
                return company;
            }, function(response){
                toastModel.showToast("error", "Error." + response.statusText);
            });
        };

        var get_reply = function(review){
            ajax.get(dataFactory.companyURL(review.id).getReply,
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

        var get_flagged = function(review){
            ajax.get(dataFactory.companyURL(review.id).getFlagged,
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
            ajax.create(dataFactory.companyURL().addFlagged,
                {
                    'reviewId': reviewId,
                    'accountId': $rootScope.userData.accountId
                },
                function(response){}
            )
        };

        var get_helpful = function(review){
            ajax.get(dataFactory.companyURL(review.id).getHelpful,
                {
                    'reviewId': review.id,
                    'accountId': $rootScope.userData.accountId
                },
                function(response){
                    review['helpful'] = response.data[0];
                }
            )
        };

        this.get_company_reviews = function(params, callback){
            return ajax.get(dataFactory.companyURL($stateParams.companyId).reviews,
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
        }

        this.add_company_reviews = function(params, callback){
            ajax.get(dataFactory.companyURL($stateParams.companyId).addReviews, 
                {
                    "_limit" : 1,
                    "_order" : "DESC",
                    "_sort" : "id"
                }, 
                function(response){  
                    var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1); 
                    params["id"] = lastId;
                    params["companyId"] = $stateParams.companyId;
                    params["reply"] = false;
                    params["status"] = true;
                    params["date"] = moment().format('x');
                    params["like"] = 0;
                    params["dislike"] = 0;

                    return ajax.create(dataFactory.companyURL($stateParams.companyId).addReviews,
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

        this.update_company_reviews = function(id, params, callback){
            ajax.get(dataFactory.companyURL(id).get_review,
                {},
                function(response){
                    var review= response.data;
                    if(params.reply){
                        review.reply = params.reply;
                    }else{
                        review.like = params.like;
                        review.dislike = params.dislike;
                    }

                    ajax.update(dataFactory.companyURL(id).update_review,
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
            return ajax.create(dataFactory.companyURL($stateParams.companyId).addHelpful,
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
            ajax.update(dataFactory.companyURL(id).updateHelpful,
                helpful,
                function(response){}
            )
        };


    }]);