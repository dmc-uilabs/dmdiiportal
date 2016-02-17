angular.module('dmc.onboarding')
.controller('homeController',
	['$scope', '$rootScope', '$mdDialog', 'DMCUserModel',
	function ($scope, $rootScope, $mdDialog, DMCUserModel) {
		$scope.showModalBasicInformations = function(){
			$mdDialog.show({
			    controller: "BasicInformationsController",
			    templateUrl: 'templates/onboarding/basic-informations.html',
			    parent: angular.element(document.body),
			    clickOutsideToClose: false
		    })
		    .then(function() {
		      	$scope.showModalTermsConditions();
		    }, function() {
		    });
		}
		$scope.showModalTermsConditions = function(){
			$mdDialog.show({
			    controller: "TermsConditionsController",
			    templateUrl: 'templates/onboarding/terms-conditions.html',
			    parent: angular.element(document.body),
			    clickOutsideToClose: false
		    })
		    .then(function(answer) {
		      	$scope.$parent.first = false;
		      	$rootScope.userData.termsConditions = true;
		      	DMCUserModel.UpdateUserData($rootScope.userData);
		    }, function() {
		    });
		}
		$scope.user = DMCUserModel.getUserData().then(function(result){
			if(!result.termsConditions){
				$scope.showModalBasicInformations();
			}
		});

}]);


