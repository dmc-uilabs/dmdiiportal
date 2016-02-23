'use strict';
angular.module('dmc.component.members-card', [
		'dmc.widgets.stars',
])
.directive('dmcMembersCard', function(){
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: {
			cardSource: '=',
		},
		templateUrl: 'templates/components/members-card/members-card.html',
		controller: function($scope, $mdDialog){
            $scope.showMembers = function(id, ev){
                console.info('index', id);
                $(window).scrollTop();
                  $mdDialog.show({
                      controller: "showMembers",
                      templateUrl: "templates/components/members-card/show-members.html",
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:true,
                      locals: {
                          "id" : id
                      }
                  }).then(function() {
                      $(window).scrollTop();
                  }, function() {
                      $(window).scrollTop();
                  });
            }
		}
	}
})
.directive('dmcAddMembersCard', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/components/members-card/add-members-card.html',
        scope:{
            compareMember: '=',
            cardSource: '=',
            inviteMember: '=',
            favoriteMember: '='
        },
        controller: function ($scope) {
            $scope.addToInvitation = function(){
                $scope.inviteMember($scope.cardSource);
                $scope.cardSource.isInvite = ($scope.cardSource.isInvite ? false : true);
            };

            $scope.addToCompare = function(){
                $scope.compareMember($scope.cardSource);
                $scope.cardSource.isCompare = ($scope.cardSource.isCompare ? false : true);

            };

            $scope.addToFavorite = function(){
                $scope.favoriteMember($scope.cardSource);
                $scope.cardSource.favorite = ($scope.cardSource.favorite ? false : true);
            };

        }
    }
})
.controller('showMembers', ['ajax', 'dataFactory', '$scope', '$mdDialog', 'id', function(ajax, dataFactory, $scope, $mdDialog, id){
    console.info('showMembers', id);
    $scope.profile = [];
    
    $scope.history = {
        leftColumn: {
            title: "Public",
            viewAllLink: "/all.php#/history/profile/"+id+"/public",
            list: []
        },
        rightColumn: {
            title: "Mutual",
            viewAllLink: "/all.php#/history/profile/"+id+"/mutual",
            list:[]
        }
    }

    // get profile history
    ajax.get(dataFactory.profiles(id).history, 
        {
            "_limit": 3,
            "section": "public"
        }, 
        function(response){
            var data = response.data;
            for(var i in data){
                data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                switch(data[i].type){
                    case "completed":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;
                    case "added":
                        data[i].icon = "images/ic_group_add_black_24px.svg";
                        break;
                    case "rated":
                        data[i].icon = "images/ic_star_black_24px.svg";
                        break;
                    case "worked":
                        data[i].icon = "images/icon_project.svg";
                        break;  
                    case "favorited":
                        data[i].icon = "images/ic_favorite_black_24px.svg";
                        break;   
                    case "shared":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;   
                    case "discussion":
                        data[i].icon = "images/ic_forum_black_24px.svg";
                        break;                                  
                }
            }
            $scope.history.leftColumn.list = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }
    );

    // get Profile history
    ajax.get(dataFactory.profiles(id).history, 
        {
            "_limit": 3,
            "section": "mutual"
        }, 
        function(response){
            var data = response.data;
            for(var i in data){
                data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                switch(data[i].type){
                    case "completed":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;
                    case "added":
                        data[i].icon = "images/ic_group_add_black_24px.svg";
                        break;
                    case "rated":
                        data[i].icon = "images/ic_star_black_24px.svg";
                        break;
                    case "worked":
                        data[i].icon = "images/icon_project.svg";
                        break;  
                    case "favorited":
                        data[i].icon = "images/ic_favorite_black_24px.svg";
                        break;   
                    case "shared":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;   
                    case "discussion":
                        data[i].icon = "images/ic_forum_black_24px.svg";
                        break;                                  
                }
            }
            $scope.history.rightColumn.list = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }
    );

    ajax.get(dataFactory.profiles(id).get,{},function(response){
        var profile = response.data;
        $scope.profile = profile;
    })
    $scope.cancel = function(){
        $mdDialog.hide();
    }

}]).controller('showCompany', ['$http', '$q', 'dataFactory', '$scope', '$mdDialog', 'id', function($http, $q, dataFactory, $scope, $mdDialog, id){
        console.info('showCompany', id);
        $scope.company = [];

        $scope.history = {
            leftColumn: {
                title: "Public",
                viewAllLink: "/all.php#/history/company/"+id+"/public",
                list: []
            },
            rightColumn: {
                title: "Mutual",
                viewAllLink: "/all.php#/history/company/"+id+"/mutual",
                list:[]
            }
        }

        var promises = {
            "company": $http.get(dataFactory.companyURL(id).get),
            "videos": $http.get(dataFactory.getCompanyVideos(id)),
            "images": $http.get(dataFactory.getCompanyImages(id)),
            "skillsImages": $http.get(dataFactory.getCompanySkillsImages(id)),
            "skills": $http.get(dataFactory.getCompanySkills(id)),
            "keyContacts": $http.get(dataFactory.getCompanyKeyContacts(id)),
            "public_history": $http.get(dataFactory.companyURL(id).history,{params: {
                "_limit": 3,
                "section": "public"
            }}),
            "private_history": $http.get(dataFactory.companyURL(id).history,{params: {
                "_limit": 3,
                "section": "mutual"
            }})
        }

        $q.all(promises).then(function(responses){
            $scope.company = responses.company.data;
            $scope.company["videos"] = responses.videos.data;
            $scope.company["images"] = responses.images.data;
            $scope.company["skillsImages"] = responses.skillsImages.data;
            $scope.company["skills"] = responses.skills.data;
            $scope.company["keyContacts"] = responses.keyContacts.data;

            for(var i in $scope.company["keyContacts"]){
                if($scope.company["keyContacts"][i].type == 1){
                    $scope.company["keyContacts"][i].type = "LEGAL";
                }else if($scope.company["keyContacts"][i].type == 2){
                    $scope.company["keyContacts"][i].type = "LEGAL 2";
                }
            };

            var data = responses.public_history.data;
            for(var i in data){
                data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                switch(data[i].type){
                    case "completed":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;
                    case "added":
                        data[i].icon = "images/ic_group_add_black_24px.svg";
                        break;
                    case "rated":
                        data[i].icon = "images/ic_star_black_24px.svg";
                        break;
                    case "worked":
                        data[i].icon = "images/icon_project.svg";
                        break;  
                    case "favorited":
                        data[i].icon = "images/ic_favorite_black_24px.svg";
                        break;   
                    case "shared":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;   
                    case "discussion":
                        data[i].icon = "images/ic_forum_black_24px.svg";
                        break;                                  
                }
            }
            $scope.history.leftColumn.list = data;

            var data = responses.private_history.data;
            for(var i in data){
                data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                switch(data[i].type){
                    case "completed":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;
                    case "added":
                        data[i].icon = "images/ic_group_add_black_24px.svg";
                        break;
                    case "rated":
                        data[i].icon = "images/ic_star_black_24px.svg";
                        break;
                    case "worked":
                        data[i].icon = "images/icon_project.svg";
                        break;  
                    case "favorited":
                        data[i].icon = "images/ic_favorite_black_24px.svg";
                        break;   
                    case "shared":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;   
                    case "discussion":
                        data[i].icon = "images/ic_forum_black_24px.svg";
                        break;                                  
                }
            }
            $scope.history.rightColumn.list = data;
        })


        /*ajax.get(dataFactory.companyURL(id).get,{},function(response){
            var company = response.data;
            $scope.company = company;
        })

        // get company images
        var callbackVideaos = function(data){
            $scope.company.videos = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        companyProfileModel.getVideos($scope.company.id, callbackVideaos);

        // get company images
        var callbackImages = function(data){
            $scope.company.images = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        companyProfileModel.getImages($scope.company.id, callbackImages);
*/
        $scope.cancel = function(){
            $mdDialog.hide();
        }

    }])
    .directive('shareMembersCard', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/components/members-card/share-members-card.html',
            scope:{
                cardSource: '=',
                favoriteMember: '=',
                share: '='
            },
            controller: function ($scope) {
            }
        }
    }).service('companyProfileModel', ['ajax', 'dataFactory', '$stateParams', 'toastModel', '$rootScope',
        function (ajax, dataFactory, $stateParams, toastModel, $rootScope) {
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


            this.getCompanyHistory = function(params, callback){
                return ajax.get(dataFactory.companyURL($stateParams.companyId).history,
                    params,
                    function(response){
                        callback(response.data)
                    }
                )
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

            var get_reply = function(review){
                ajax.get(dataFactory.companyURL(review.id).getReply,
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
                ajax.get(dataFactory.companyURL(review.id).getHelpful,
                    {
                        'reviewId': review.id,
                        'accountId': $rootScope.userData.accountId
                    },
                    function(response){
                        review['helpful'] = response.data[0];
                    }
                )
            }

            this.get_company_reviews = function(params, callback){
                return ajax.get(dataFactory.companyURL($stateParams.companyId).reviews,
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


        }])
