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

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
                CompareModel.get('services',userData);
            });

            $scope.memberLoading = true;

            var loadingData = function(start){ // progress line
                $scope.downloadData = start;
            };


            // callback for member
            var callbackFunction = function(response){
                console.log($scope.member)
                $scope.member = response.data;
				$scope.memberLoading = false;
            };

            var responseData = function(){
                var data = {
                    id: $stateParams.memberId
                };
                return data;
            };

            $scope.getDMDIIMember = function(){
                loadingData(true);
                ajax.get(dataFactory.getDMDIIMember(responseData()), null, callbackFunction);
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
