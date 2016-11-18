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
                 isFavorite){

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.userData = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.userData = res;

                if ($scope.userData.roles && angular.isDefined($scope.userData.roles[$stateParams.memberId])) {
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
            // callback for member
            var callbackFunction = function(response){
                $scope.member = response.data;

                var startDate = $scope.member.startDate.split('-');
                $scope.startDate = startDate[1] + '-' + startDate[2] + '-' + startDate[0];

                // if (!$scope.member.projects) {
                //     ajax.get(dataFactory.getDMDIIMemberProjects(), { page: 0, pageSize: 50, dmdiiMemberId: $scope.member.id }, function(response) {
                //         $scope.member.projects = response.data.data;
                //     });
                // }

                $scope.getCompanyMembers($scope.member.id);

                $scope.getDMDIIMemberStorefront($scope.member.id);

                $scope.getProjects($scope.member.id);
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

            $scope.getProjects = function(id) {
                ajax.get(dataFactory.getDMDIIMemberProjects().prime, {dmdiiMemberId: id, page: 0, pageSize: 50}, function(response) {
                    $scope.primes = response.data.data;
                });
                ajax.get(dataFactory.getDMDIIMemberProjects().contributing, {dmdiiMemberId: id}, function(response) {
                    $scope.contributing = response.data;
                });
            }

            var callbackMembers = function(response) {
                $scope.contacts = [];
                angular.forEach(response.data, function(member) {
                    if (member.userContactInfo && member.userContactInfo.userMemberPortalContactInfo && member.userContactInfo.userMemberPortalContactInfo.id) {
                        $scope.member.contacts.push({
                            firstName: member.firstName,
                            lastName: member.lastName,
                            phone: member.userContactInfo.userMemberPortalContactInfo.phone,
                            email:  member.userContactInfo.userMemberPortalContactInfo.email
                        });
                    }
                });
            }
            $scope.getCompanyMembers = function(id) {
                ajax.get(dataFactory.getUsersByOrganization(id), {}, callbackMembers);
            }

			$scope.storefront = [];

			var callbackStorefrontFunction = function(response){
				$scope.storefront = response.data;
			};

			var responseStorefrontData = function(){
				var data = {
					_limit: 12,
					_start: 0,
                    published: true
				};
				return data;
			};

            $scope.getDMDIIMemberStorefront = function(id){
                ajax.get(dataFactory.getCompanyServices(id), responseStorefrontData(), callbackStorefrontFunction);
            };
			// $scope.getDMDIIMemberStorefront = function() {
			// 	ajax.get(dataFactory.getServices(), responseStorefrontData(), callbackStorefrontFunction);
			// }
        }
    ]
).filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        };
    });
