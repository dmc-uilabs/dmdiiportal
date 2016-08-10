'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.member')
    .controller('DMCMemberPageController',[
        '$state',
        '$stateParams',
        '$scope',
        '$rootScope',
        '$cookies',
        'ajax',
        'dataFactory',
        'socketFactory',
        '$location',
        'is_search',
        'DMCUserModel',
        '$window',
        'CompareModel',
        'isFavorite',
        function($state,
                 $stateParams,
                 $scope,
                 $rootScope,
                 $cookies,
                 ajax,
                 dataFactory,
                 socketFactory,
                 $location,
                 is_search,
                 DMCUserModel,
                 $window,
                 CompareModel,
                 isFavorite){

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };
            $scope.userData = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.userData = res;
                CompareModel.get('services', $scope.userData);

                if (angular.isDefined($scope.userData.roles[$stateParams.memberId])) {
                    $scope.userData.isVerified = true;
                    switch ($scope.userData.roles[$stateParams.memberId]) {
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

            $scope.memberLoading = true;

            var loadingData = function(start){ // progress line
                $scope.downloadData = start;
            };

            var getProjects = function() {
            }

            var callbackMembers = function(reponse) {
                $scope.contacts = [];
                angular.forEach(response.data, function(member) {
                    if (member.userContactInfo.userMemberPortalContactInfo && member.userContactInfo.userMemberPortalContactInfo.id) {
                        $scope.member.contacts.push({
                            firstName: member.firstName,
                            lastName: member.lastName,
                            phone: member.userContactInfo.userMemberPortalContactInfo.phone,
                            email:  member.userContactInfo.userMemberPortalContactInfo.email
                        })
                    }
                })
            }
            $scope.getCompanyMembers = function() {
                ajax.get(dataFactory.getUsersByOrganization($scope.company.id), {}, callbackMembers);
            }
            $scope.getCompanyMembers();

            // callback for member
            var callbackFunction = function(response){
                $scope.member = response.data;

                if (!member.projects) {
                    ajax.get(dataFactory.getDMDIIMemberProjects(), { page: 0, pageSize: 50, memberId: $stateParams.memberId }, function(response) {
                        $scope.member.projects = response.data.results;
                    });
                }

                $scope.memberLoading = false;
            };

            var responseData = function(){
                var data = {};
                return data;
            };

            $scope.getDMDIIMember = function(){
                loadingData(true);
                ajax.get(dataFactory.getDMDIIMember($stateParams.memberId).get, responseData(), callbackFunction);
            };
            $scope.getDMDIIMember();

			$scope.storefront = [];

			var callbackStorefrontFunction = function(response){
				$scope.storefront = response.data;
			};

			var responseStorefrontData = function(){
				var data = {
					_limit : 12,
					_start : 0
				};
				return data;
			};

			$scope.getDMDIIMemberStorefront = function() {
				ajax.get(dataFactory.getServices(), responseData(), callbackStorefrontFunction);
			}
			$scope.getDMDIIMemberStorefront();
        }
    ]
);
