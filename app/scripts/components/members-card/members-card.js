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
			companyId: '=',
			fromSearch: '='
		},
		templateUrl: 'templates/components/members-card/members-card.html',
		controller: ['$scope', '$mdDialog', 'ajax', 'dataFactory', 'DMCUserModel', 'toastModel', function($scope, $mdDialog, ajax, dataFactory, DMCUserModel, toastModel){
            $scope.projects = [];
            $scope.addingToProject = false;
						var addProjectsToScope = function() {
							ajax.get(
								dataFactory.getProjects(), {},
								function(response){
									$scope.projects = response.data;
								}
							);
						};

			$scope.userData = null;
			DMCUserModel.getUserData().then(function(res){
				$scope.userData = res;

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
			});

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.addToProject = function(){
                $scope.addingToProject = true;
            };

            $scope.cancelAddToProject = function(){
                $scope.addingToProject = false;
            };

            // add member to project
            $scope.saveToProject = function(projectId){
                var project = null;
								addProjectsToScope();
                for(var i in $scope.projects){
                    if($scope.projects[i].id == projectId){
                        project = $scope.projects[i];
                        break;
                    };
                };
                if(project) {
                    ajax.create(dataFactory.createMembersToProject(),
                        {
                            'profileId': $scope.cardSource.id,
                            'projectId': project.id,
                            'fromProfileId': $scope.$root.userData.profileId,
                            'from': $scope.$root.userData.displayName,
                            'date': moment(new Date).format('x'),
                            'accept': false
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
                };
            };

			$scope.roles = [
				'ADMIN',
				'VIP',
				'MEMBER'
			];

			if ($scope.cardSource.roles && angular.isDefined($scope.cardSource.roles[$scope.companyId])) {
				$scope.cardSource.isVerified = true;
				$scope.role = $scope.cardSource.roles[$scope.companyId];
			} else {
				$scope.cardSource.isVerified = false;
			};

			$scope.setRole = function() {
                $scope.settingRole = true;
            };

            $scope.cancelSetRole = function() {
                $scope.settingRole = false;
            };

			var setRoleCallback = function(response) {
				toastModel.showToast('success', $scope.cardSource.firstName + ' ' + $scope.cardSource.lastName + ' role updated!');
				$scope.isMember = true;
			};

			$scope.resendNotification = function() {
				ajax.create(dataFactory.requestVerification(), {});
			};

			$scope.saveMember = function() {
				var role = {
					userId: $scope.cardSource.id,
					organizationId: $scope.companyId,
					role: $scope.role
				}
				$scope.settingRole = false;
				ajax.put(dataFactory.userRole(), role, setRoleCallback);
			};

			$scope.removeMember = function() {
				ajax.put(dataFactory.unverify($scope.cardSource.id), {}, function(response) {
					if(response.status === 200) {
						toastModel.showToast('success', $scope.cardSource.firstName + ' ' + $scope.cardSource.lastName + ' removed from Organization!');
						$scope.isRemoved = true;
					} else {
						toastModel.showToast('error', response.data)
					};
				});
			};

			$scope.declineMember = function() {
				ajax.put(dataFactory.declineMember($scope.cardSource.id), {}, function(response) {
					if(response.status === 200) {
						toastModel.showToast('success', $scope.cardSource.firstName + ' ' + $scope.cardSource.lastName + ' declined!');
						$scope.isRemoved = true;
					} else {
						toastModel.showToast('error', response.data)
					};
				});
			};

			var tokenCallback = function(response) {
				$scope.token = response.data.token;
                $scope.userId = response.data.userId;

				$mdDialog.show({
					controller: 'DisplayTokenController',
					templateUrl: 'templates/components/token-modal/token-modal.html',
					parent: angular.element(document.body),
					locals: {
					   token: $scope.token, userId: $scope.userId
					},
					clickOutsideToClose: true
				});
			};

			$scope.generateToken = function() {
				ajax.create(dataFactory.generateToken($scope.cardSource.id), {}, tokenCallback)
			};

            $scope.showMembers = function(id, ev){
                $(window).scrollTop();
                  $mdDialog.show({
                      controller: 'showMembers',
                      templateUrl: 'templates/components/members-card/show-members.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:true,
                      locals: {
                          'id' : id
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
                    };
                };
            };

						var buildDisplayName = function(){
							var fullName = $scope.cardSource.firstName+" "+$scope.cardSource.lastName
							// fullName = fullName || $scope.cardSource.displayName
							if (fullName.length < 37) {
								$scope.displayName = fullName
							} else {
								$scope.displayName = fullName.substring(0,35)+'...'
							}
						}

						buildDisplayName();

						$scope.descriptionLenLimit=80;
	          $scope.descriptionLenLimitPrompt = 'more'
						$scope.cardSource.aboutMe = $scope.cardSource.aboutMe || ""

	          $scope.switchDescriptionLenLimit = function() {
	            if ($scope.descriptionLenLimit == $scope.cardSource.aboutMe.length) {
	              $scope.descriptionLenLimit = 80
	              $scope.descriptionLenLimitPrompt = 'more';
	            } else {
	              $scope.descriptionLenLimit = $scope.cardSource.aboutMe.length;
	              $scope.descriptionLenLimitPrompt = 'less';
	            }
	          }

	          $scope.descriptionTooLong = function() {
	            return 80 < $scope.cardSource.aboutMe.length;
	          }
						
		}]
	};
})
.controller('DisplayTokenController',
	['$scope', '$rootScope', '$mdDialog', 'ajax', 'dataFactory', 'token', 'userId',
	function ($scope, $rootScope, $mdDialog, ajax, dataFactory, token, userId) {
        $scope.token = token;
        $scope.userId = userId;
		$scope.cancel = function(){
            $mdDialog.hide();
		};

        $scope.emailToken = function() {
            ajax.create(dataFactory.emailToken(userId, token), {});
        };
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
    };
})
.controller('showMembers', ['ajax', 'dataFactory', '$scope', '$mdDialog', 'id', function(ajax, dataFactory, $scope, $mdDialog, id){
    $scope.profile = [];

    $scope.history = {
        leftColumn: {
            title: 'Public',
            viewAllLink: '/all.php#/history/profile/'+id+'/public',
            list: []
        },
        rightColumn: {
            title: 'Mutual',
            viewAllLink: '/all.php#/history/profile/'+id+'/mutual',
            list:[]
        }
    };
/*
    // get profile history
    ajax.get(dataFactory.profiles(id).history,
        {
            '_limit': 3,
            'section': 'public'
        },
        function(response){
            var data = response.data;
            for(var i in data){
                data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
                switch(data[i].type){
                    case 'completed':
                        data[i].icon = 'images/ic_done_all_black_24px.svg';
                        break;
                    case 'added':
                        data[i].icon = 'images/ic_group_add_black_24px.svg';
                        break;
                    case 'rated':
                        data[i].icon = 'images/ic_star_black_24px.svg';
                        break;
                    case 'worked':
                        data[i].icon = 'images/icon_project.svg';
                        break;
                    case 'favorited':
                        data[i].icon = 'images/ic_favorite_black_24px.svg';
                        break;
                    case 'shared':
                        data[i].icon = 'images/ic_done_all_black_24px.svg';
                        break;
                    case 'discussion':
                        data[i].icon = 'images/ic_forum_black_24px.svg';
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
            '_limit': 3,
            'section': 'mutual'
        },
        function(response){
            var data = response.data;
            for(var i in data){
                data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
                switch(data[i].type){
                    case 'completed':
                        data[i].icon = 'images/ic_done_all_black_24px.svg';
                        break;
                    case 'added':
                        data[i].icon = 'images/ic_group_add_black_24px.svg';
                        break;
                    case 'rated':
                        data[i].icon = 'images/ic_star_black_24px.svg';
                        break;
                    case 'worked':
                        data[i].icon = 'images/icon_project.svg';
                        break;
                    case 'favorited':
                        data[i].icon = 'images/ic_favorite_black_24px.svg';
                        break;
                    case 'shared':
                        data[i].icon = 'images/ic_done_all_black_24px.svg';
                        break;
                    case 'discussion':
                        data[i].icon = 'images/ic_forum_black_24px.svg';
                        break;
                }
            }
            $scope.history.rightColumn.list = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }
    );
*/
    ajax.get(dataFactory.userAccount(id).get,{},function(response){
        var profile = response.data;
        $scope.profile = profile;
    });

    $scope.cancel = function(){
        $mdDialog.hide();
    };
}])
.controller('showCompany', ['$http', '$q', 'dataFactory', '$scope', '$mdDialog', 'id', function($http, $q, dataFactory, $scope, $mdDialog, id){
    $scope.company = [];

    $scope.history = {
        leftColumn: {
            title: 'Public',
            viewAllLink: '/all.php#/history/company/'+id+'/public',
            list: []
        },
        rightColumn: {
            title: 'Mutual',
            viewAllLink: '/all.php#/history/company/'+id+'/mutual',
            list:[]
        }
    };

    var promises = {
        'company': $http.get(dataFactory.getOrganization(id)),
        'videos': $http.get(dataFactory.documentsUrl().getList, { params: { parentType: 'ORGANIZATION', parentId: id, docClass: 'VIDEO', recent: 3}}),
        'images': $http.get(dataFactory.documentsUrl().getList, { params: { parentType: 'ORGANIZATION', parentId: id, docClass: 'IMAGE', recent: 3}})

				/* uncomment when implemented/fixed
				,'public_history': $http.get(dataFactory.companyURL(id).history,{params: {
            '_limit': 3,
            'section': 'public'
        }}),
        'private_history': $http.get(dataFactory.companyURL(id).history,{params: {
            '_limit': 3,
            'section': 'mutual'
        }})*/
    };

    $q.all(promises).then(function(responses){
        $scope.company = responses.company.data;
        $scope.company['videos'] = responses.videos.data.data || [];
        $scope.company['images'] = responses.images.data.data || [];

        var data = responses.public_history.data;
        for(var i in data){
            data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
            switch(data[i].type){
                case 'completed':
                    data[i].icon = 'images/ic_done_all_black_24px.svg';
                    break;
                case 'added':
                    data[i].icon = 'images/ic_group_add_black_24px.svg';
                    break;
                case 'rated':
                    data[i].icon = 'images/ic_star_black_24px.svg';
                    break;
                case 'worked':
                    data[i].icon = 'images/icon_project.svg';
                    break;
                case 'favorited':
                    data[i].icon = 'images/ic_favorite_black_24px.svg';
                    break;
                case 'shared':
                    data[i].icon = 'images/ic_done_all_black_24px.svg';
                    break;
                case 'discussion':
                    data[i].icon = 'images/ic_forum_black_24px.svg';
                    break;
            };
        };

        $scope.history.leftColumn.list = data;

        var data = responses.private_history.data;
        for(var i in data){
            data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
            switch(data[i].type){
                case 'completed':
                    data[i].icon = 'images/ic_done_all_black_24px.svg';
                    break;
                case 'added':
                    data[i].icon = 'images/ic_group_add_black_24px.svg';
                    break;
                case 'rated':
                    data[i].icon = 'images/ic_star_black_24px.svg';
                    break;
                case 'worked':
                    data[i].icon = 'images/icon_project.svg';
                    break;
                case 'favorited':
                    data[i].icon = 'images/ic_favorite_black_24px.svg';
                    break;
                case 'shared':
                    data[i].icon = 'images/ic_done_all_black_24px.svg';
                    break;
                case 'discussion':
                    data[i].icon = 'images/ic_forum_black_24px.svg';
                    break;
            };
        };
        $scope.history.rightColumn.list = data;
    });

    $scope.cancel = function(){
        $mdDialog.hide();
    };
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
            };

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
                    };
                };
            };
        }
    };
});
