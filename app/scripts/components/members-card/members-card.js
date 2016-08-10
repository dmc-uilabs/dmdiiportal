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
			companyId: '='
		},
		templateUrl: 'templates/components/members-card/members-card.html',
		controller: ['$scope', '$mdDialog', 'ajax', 'dataFactory', 'DMCUserModel', function($scope, $mdDialog, ajax, dataFactory, DMCUserModel){
            $scope.projects = [];
            $scope.addingToProject = false;
            ajax.get(
                dataFactory.getProjects(), {},
                function(response){
                    $scope.projects = response.data;
                }
            );

			$scope.user = null;
			DMCUserModel.getUserData().then(function(res){
				$scope.user = res;
			});

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

			if ($scope.userData.roles && angular.isDefined($scope.userData.roles[$scope.companyId])) {
				$scope.userData.isVerified = true;
				switch ($scope.userData.roles[$scope.companyId]) {
					case 'ADMIN':
						$scope.userData.isAdmin = true;
						break;
					case 'VIP':
						$scope.userData.isVIP = true;
						break;
					case 'MEMBER':
						$scope.userData.isMember = true;
						break;
				}
			}

            $scope.addToProject = function(){
                $scope.addingToProject = true;
            };

            $scope.cancelAddToProject = function(){
                $scope.addingToProject = false;
            };

            // add member to project
            $scope.saveToProject = function(projectId){
                var project = null;
                for(var i in $scope.projects){
                    if($scope.projects[i].id == projectId){
                        project = $scope.projects[i];
                        break;
                    }
                }
                if(project) {
                    ajax.create(dataFactory.createMembersToProject(),
                        {
                            "profileId": $scope.cardSource.id,
                            "projectId": project.id,
                            "fromProfileId": $scope.$root.userData.profileId,
                            "from": $scope.$root.userData.displayName,
                            "date": moment(new Date).format('x'),
                            "accept": false
                        },
                        function (response) {
                            $scope.cancelAddToProject();
                            $scope.cardSource.added = true;

                            $scope.cardSource.lastProject = {
                                title: project.title,
                                href: '/project.php#/' + project.id + '/home'
                            };
                            setTimeout(function () {
                                $scope.cardSource.added = false;
                                apply();
                            }, 10000);

                            var apply = function(){
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                            };
                        }
                    );
                }
            };

			$scope.roles = {
				2: 'Admin',
				3: 'VIP',
				4: 'Member'
			}

			if (angular.isDefined($scope.cardSource.roles[$scope.companyId])) {
				switch ($scope.cardSource.roles[$scope.companyId]) {
					case 'ADMIN':
						$scope.roleId = 2;
						break;
					case 'VIP':
						$scope.roleId = 3;
						break;
					case 'MEMBER':
						$scope.roleId = 4;
						break;
				}
			}

			$scope.setRole = function() {
                $scope.settingRole = true;
            };

            $scope.cancelSetRole = function() {
                $scope.settingRole = false;
            };

			var setRoleCallback = function(response) {
				$scope.isMember = true;
			}
			$scope.saveMember = function() {
				var role = {
					userId: $scope.cardSource.id,
					organizationId: $scope.cardSource.$scope.companyId,
					roleId: $scope.roleId
				}
				$scope.addingMember = false;
				ajax.update(dataFactory.userRole(), role, setRoleCallback);
			}

			var tokenCallback = function(response) {
				$scope.token = response.data.token;

				$mdDialog.show({
					controller: 'DisplayTokenController',
					templateUrl: "templates/components/token-modal/token-modal.html",
					parent: angular.element(document.body),
					locals: {
					   token: $scope.token
				},
					clickOutsideToClose: true
				});
			}
			$scope.generateToken = function() {
				ajax.create(dataFactory.generateToken(), {userId: $scope.cardSource.id}, tokenCallback)
			}
            $scope.showMembers = function(id, ev){
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
            };

            $scope.followMember = function(){
                if($scope.$root.userData) {
                    if (!$scope.cardSource.follow) {
                        ajax.create(dataFactory.followMember(), {
                            accountId: $scope.$root.userData.accountId,
                            profileId: $scope.cardSource.id
                        }, function (response) {
                            $scope.cardSource.follow = response.data;
                            apply();
                        });
                    } else {
                        ajax.delete(dataFactory.followMember($scope.cardSource.follow.id), {},
                            function (response) {
                                $scope.cardSource.follow = null;
                            }
                        );
                    }
                }
            };
		}]
	}
})
.controller('DisplayTokenController',
	['$scope', '$rootScope', '$mdDialog', 'token',
	function ($scope, $rootScope, $mdDialog, token) {
        $scope.token = token;
		$scope.cancel = function(){
            $mdDialog.hide();
		}
}])
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
                data[i].date = moment(data[i].date).format("MM/DD/YYYY hh:mm A");
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
                data[i].date = moment(data[i].date).format("MM/DD/YYYY hh:mm A");
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
}])
.controller('showCompany', ['$http', '$q', 'dataFactory', '$scope', '$mdDialog', 'id', function($http, $q, dataFactory, $scope, $mdDialog, id){
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
            data[i].date = moment(data[i].date).format("MM/DD/YYYY hh:mm A");
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
            data[i].date = moment(data[i].date).format("MM/DD/YYYY hh:mm A");
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
        controller: function ($scope,ajax,dataFactory,DMCUserModel,$rootScope) {
            $scope.userData = DMCUserModel.getUserData();
            $scope.userData.then(function(res){
                $scope.userData = res;
                isFavorite();
            });

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            function isFavorite(){
                ajax.get(dataFactory.getAccountFollowedMembers($scope.userData.accountId), {
                    profileId: $scope.cardSource.id
                }, function (response) {
                    $scope.cardSource.favorite = (response.data.length > 0 ? response.data[0] : null);
                    apply();
                });
            }

            $scope.addToFavorite = function(){
                if($scope.userData) {
                    if (!$scope.cardSource.favorite) {
                        ajax.create(dataFactory.followMember(), {
                            accountId: $scope.userData.accountId,
                            profileId: $scope.cardSource.id
                        }, function (response) {
                            $scope.cardSource.favorite = response.data;
                            apply();
                        });
                    } else {
                        ajax.delete(dataFactory.followMember($scope.cardSource.favorite.id), {},
                            function (response) {
                                $scope.cardSource.favorite = null;
                            }
                        );
                    }
                }
            };
        }
    }
});
