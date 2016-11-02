angular.module('dmc.onboarding')
.controller('StorefrontController',
	['$scope', '$rootScope', '$state', '$q', 'ajax', 'dataFactory', 'fileUpload',
	function ($scope, $rootScope, $state, $q, ajax, dataFactory, fileUpload) {
		if($state.current.name == 'onboarding.storefront'){
			$state.go($scope.storefront[0].state);
		}
        $scope.activePage = $state;

        $scope.newLogo = [];
		$scope.featureImage = [];

//upload file

		$scope.removeFeatureImage = function() {
			if ($scope.storefront[0].data.featureImage && $scope.storefront[0].data.featureImage.length > 0 && $scope.storefront[0].data.featureImage[0].documentUrl) {
				var deleteFeatureImage = true;
			}
		}

        $scope.removeLogo = function(){
			if ($scope.storefront[2].data.logoImage && $scope.storefront[2].data.logoImage.length > 0 && $scope.storefront[2].data.logoImage[0].documentUrl) {
				var deleteLogoImage = true;
			}
        }

		var uploadLogoImage = function(companyId) {
			return fileUpload.uploadFileToUrl($scope.newLogo[0].file, {id: companyId}, 'company').then(function(data){

			});
		}

		var uploadFeatureImage = function(companyId) {
			return fileUpload.uploadFileToUrl($scope.featureImage[0].file, {id: companyId}, 'company').then(function(data){

			});
		}

		var deleteImage = function(imageId){
            ajax.delete(
                dataFactory.documentsUrl(imageId).delete, {}, function(response){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        };

        $scope.next = function(index){
            $scope.storefront[index].done = true;
			var promises = [];
			$scope.saveStorefront($scope.storefront[index].data, function(){
				if(index === 0 && $scope.featureImage.length > 0){
					promises.push(uploadFeatureImage(companyId))
					removeFeatureImage();
				}

				if (deleteFeatureImage) {
					promises.push(deleteImage($scope.storefront[0].data.featureImage[0].id));
				}

				$q.all(promises).then(function() {
					$(window).scrollTop(0);
					$state.go('^' + $scope.storefront[index+1].state);
				});
			});

        }

        $scope.finish = function(index){
            $scope.storefront[index].done = true;
			var promises = [];
			$scope.saveStorefront($scope.storefront[index].data, function(){
				if ($scope.newLogo.length > 0) {
					promises.push(uploadLogoImage());
					removeLogo();
				}

				if (deleteLogoImage) {
					promises.push(deleteImage($scope.storefront[2].data.logoImage.id));
				}

				$q.all(promises).then(function() {
					$scope.saveFinish('storefront');
					$(window).scrollTop(0);
					$state.go('^.^.home');
				});
			});
		}
}]);
