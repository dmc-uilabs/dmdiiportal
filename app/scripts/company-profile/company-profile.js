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
			resolve: resolve
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

	}).service('companyProfileModel', ['dataFactory','ajax', function(dataFactory,ajax) {
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
        }
    }]);