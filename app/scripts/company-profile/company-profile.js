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
    .service('companyProfileModel', ['ajax', 'dataFactory', '$stateParams', 'toastModel',
                            function (ajax, dataFactory, $stateParams, toastModel) {
        // get company skills
        this.getSkills = function(id, callback) {
            return ajax.on(dataFactory.getCompanySkills(id),{
                    "_order" : "DESC",
                    "_sort" : "id"
                }, callback,function(){
                    toastModel.showToast("error", "Error. The problem on the server (get skills).");
                },"GET"
            );
        };

        // get company images
        this.getImages = function(id, callback){
            return ajax.on(dataFactory.getCompanyImages(id),{
                    "_order" : "DESC",
                    "_sort" : "id"
                }, callback,function(){
                    toastModel.showToast("error", "Error. The problem on the server (get images).");
                },"GET"
            );
        };

        // get company images
        this.getSkillsImages = function(id, callback){
            return ajax.on(dataFactory.getCompanySkillsImages(id),{
                    "_order" : "DESC",
                    "_sort" : "id"
                }, callback,function(){
                    toastModel.showToast("error", "Error. The problem on the server (get images).");
                },"GET"
            );
        };

        // get company videos
        this.getVideos = function(id, callback){
            return ajax.on(dataFactory.getCompanyVideos(id),{
                    "_order" : "DESC",
                    "_sort" : "id"
                }, callback,function(){
                    toastModel.showToast("error", "Error. The problem on the server (get videos).");
                },"GET"
            );
        };

        // get company contacts
        this.getKeyContacts = function(id, callback){
            return ajax.on(dataFactory.getCompanyKeyContacts(id),{
                    "_order" : "DESC",
                    "_sort" : "id"
                }, callback,function(){
                    toastModel.showToast("error", "Error. The problem on the server (get Key Contacts).");
                },"GET"
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
                                members.push(response.data ? response.data : response);
                            }
                        )
                    }
                    callback(members);
                }
            );
        };

        this.get_company = function(id){
            return ajax.get(
                dataFactory.companyURL(id).get, 
                {
                    "_embed": "company_members"
                },
                function(response){
                    var company = response.data;
                    return ajax.get(dataFactory.companyURL(id).reviews, {},
                        function(response){
                            company["company_reviews"] = response.data;
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
                            for(var i in company["company_reviews"]){
                                company["company_reviews"][i]['replyReviews'] = [];
                            }
                            return company;
                        }
                    )
                }
            )
        }

        this.get_company_reviews = function(params, callback){
            return ajax.get(dataFactory.companyURL($stateParams.companyId).reviews,
                params,
                function(response){
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
                    params["reviewId"] = 0;
                    params["status"] = true;
                    params["date"] = moment().format('MM/DD/YYYY');
                    params["userRatingReview"] = {
                        "DMC Member": "none"
                    };
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


    }]);