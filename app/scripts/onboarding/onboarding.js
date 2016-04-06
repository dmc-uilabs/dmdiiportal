'use strict';

angular.module('dmc.onboarding', [
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
    'dmc.model.question-toast-model',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.location',
    'dmc.model.toast-model',
    'dmc.model.fileUpload',
    'dmc.model.profile',
    'dmc.model.user',
    'dmc.phone-format',
    'flow'
])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('onboarding',{
                url: '',
                abstract: true,
                template: "<ui-view></ui-view>",
                controller: 'onboardingController',
                resolve: {
                    userData: ['DMCUserModel',
                        function(DMCUserModel) {
                            return DMCUserModel.getUserData();
                        }]
                }
            })
            .state('onboarding.home', {
                url: '/home',
                templateUrl: 'templates/onboarding/home.html',
                controller: 'homeController'
            })
            .state('onboarding.account', {
                url: '/account',
                templateUrl: 'templates/onboarding/account/account.html',
                controller: 'AccountController'
            })
                .state('onboarding.account.public', {
                    url: '/public-information',
                    templateUrl: 'templates/onboarding/account/public.html'
                })
                .state('onboarding.account.private', {
                    url: '/private-information',
                    templateUrl: 'templates/onboarding/account/private.html'
                })
                .state('onboarding.account.web', {
                    url: '/web-notifications',
                    templateUrl: 'templates/onboarding/account/web-notifications.html'
                })
                .state('onboarding.account.email', {
                    url: '/email-notifications',
                    templateUrl: 'templates/onboarding/account/email-notifications.html'
                })
                .state('onboarding.account.servers', {
                    url: '/servers',
                    templateUrl: 'templates/onboarding/account/servers.html'
                })

            .state('onboarding.company', {
                url: '/company',
                templateUrl: 'templates/onboarding/company/company.html',
                controller: 'CompanyController'
            })
                .state('onboarding.company.describe', {
                    url: '/company',
                    templateUrl: "templates/onboarding/company/describe.html"
                })
                .state('onboarding.company.image', {
                    url: '/company-image',
                    templateUrl: "templates/onboarding/company/image.html"
                }) 
                .state('onboarding.company.focus', {
                    url: '/rd-focus',
                    templateUrl: "templates/onboarding/company/focus.html"
                })
                .state('onboarding.company.accomplishments', {
                    url: '/accomplishments',
                    templateUrl: "templates/onboarding/company/accomplishments.html"
                })
                .state('onboarding.company.media', {
                    url: '/media',
                    templateUrl: "templates/onboarding/company/media.html"
                })
                .state('onboarding.company.tool', {
                    url: '/skills-tools',
                    templateUrl: "templates/onboarding/company/tool.html"
                }) 
                .state('onboarding.company.projects', {
                    url: '/projects',
                    templateUrl: "templates/onboarding/company/projects.html"
                })
                .state('onboarding.company.contact', {
                    url: '/contact',
                    templateUrl: "templates/onboarding/company/contact.html"
                })
                .state('onboarding.company.social', {
                    url: '/social-media',
                    templateUrl: "templates/onboarding/company/social.html"
                }) 
                .state('onboarding.company.key', {
                    url: '/key-conatcts',
                    templateUrl: "templates/onboarding/company/key.html"
                }) 
                .state('onboarding.company.membership', {
                    url: '/membership',
                    templateUrl: "templates/onboarding/company/membership.html"
                })


            .state('onboarding.profile', {
                url: '/profile',
                templateUrl: 'templates/onboarding/profile/profile.html',
                controller: 'ProfileController'
            })
                .state('onboarding.profile.basic', {
                    url: '/basic-information',
                    templateUrl: "templates/onboarding/profile/basic.html"
                })
                .state('onboarding.profile.image', {
                    url: '/profile-image',
                    templateUrl: "templates/onboarding/profile/image.html"
                }) 
                .state('onboarding.profile.skill', {
                    url: '/skills',
                    templateUrl: "templates/onboarding/profile/skill.html"
                }) 

            .state('onboarding.storefront', {
                url: '/storefront',
                templateUrl: 'templates/onboarding/storefront/storefront.html',
                controller: 'StorefrontController'
            })
                .state('onboarding.storefront.cover', {
                    url: '/cover-image',
                    templateUrl: "templates/onboarding/storefront/cover.html"
                })
                .state('onboarding.storefront.description', {
                    url: '/description',
                    templateUrl: "templates/onboarding/storefront/description.html"
                }) 
                .state('onboarding.storefront.logo', {
                    url: '/logo',
                    templateUrl: "templates/onboarding/storefront/logo.html"
                });
        $urlRouterProvider.otherwise('/home');
    })
    .service('onboardingModel', ['ajax', 'dataFactory', '$stateParams', 'toastModel',
         function (ajax, dataFactory, $stateParams, toastModel) {
            this.get_profile = function(profileId, callback){ 
                return ajax.get(
                    dataFactory.profiles(profileId).get,
                    {},
                    function(response){
                        callback(response.data);
                    }
                );
            }

            this.update_profile = function(profileId, params, callback){ 
                ajax.get(
                    dataFactory.profiles(profileId).get,
                    {},
                    function(response){
                        var profile = response.data;
                        for(var item in params){
                           profile[item] = params[item];
                        }
                        ajax.update(
                            dataFactory.profiles(profileId).update,
                            profile,
                            function(response){
                                callback(response.data);
                            }
                        );
                    }
                );
            }

             // get company skills
            this.getSkills = function(id, callback){
                return ajax.get(
                    dataFactory.getCompanySkills(id),
                    {}, 
                    function(response){
                        callback(response.data);
                    }
                );
            };

            // get company images
            this.getImages = function(id, callback){
                return ajax.get(
                    dataFactory.getCompanyImages(id),
                    {}, 
                    function(response){
                        callback(response.data);
                    }
                );
            };

            // get company images
            this.getSkillsImages = function(id, callback){
                return ajax.get(
                    dataFactory.getCompanySkillsImages(id),
                    {},
                    function(response){
                        callback(response.data);
                    }
                );
            };

            // get company videos
            this.getVideos = function(id, callback){
                return ajax.get(
                    dataFactory.getCompanyVideos(id),
                    {},
                    function(response){
                        callback(response.data);
                    }
                );
            };

            // get company contacts
            this.getKeyContacts = function(id, callback){
                return ajax.get(
                    dataFactory.getCompanyKeyContacts(id),
                    {},
                    function(response){
                        callback(response.data);
                    }
                );
            };


            this.get_company = function(companyId, callback){ 
                return ajax.get(
                    dataFactory.companyURL(companyId).get,
                    {},
                    function(response){
                        callback(response.data);
                    }
                );
            }

            this.update_company = function(companyId, params, callback){ 
                ajax.get(
                    dataFactory.companyURL(companyId).get,
                    {},
                    function(response){
                        var company = response.data;
                        for(var item in params){
                           company[item] = params[item];
                        }
                        ajax.update(
                            dataFactory.companyURL(companyId).update,
                            company,
                            function(response){
                                callback(response.data);
                            }
                        );
                    }
                );
            }


            this.get_account = function(accountId, callback){ 
                return ajax.get(
                    dataFactory.getAccount(accountId),
                    {},
                    function(response){
                        callback(response.data);
                    }
                );
            }

            this.get_account_notfications = function(accountId, callback){ 
                return ajax.get(
                    dataFactory.getUserAccountNotifications(accountId),
                    {},
                    function(response){
                        callback(response.data);
                    }
                );
            }

            this.update_account = function(accountId, params, callback){
                ajax.get(
                    dataFactory.getAccount(accountId),
                    {},
                    function(response){
                        var account = response.data;
                        for(var item in params){
                           account.privacy[item] = params[item];
                        }
                        ajax.update(
                            dataFactory.updateAccount(accountId),
                            account,
                            function(response){
                                callback(response.data);
                            }
                        );                        
                    }
                );
            }

            this.update_notfications = function(notificationId, selected, callback){ 
                ajax.update(
                    dataFactory.updateUserAccountNotification(notificationId),
                    {
                        "selected": selected
                    },
                    function(response){
                        callback(response.data);
                    }
                );
            }

            this.get_servers = function(accountId, callback){
                ajax.get(dataFactory.getAccountServersUrl(accountId), 
                    {}, 
                    function (response) {
                        callback(response.data);
                    }
                );
            };
    }])