angular.module('dmc.onboarding')
.controller('homeController',
	['$scope', '$rootScope', '$mdDialog', 'DMCUserModel',
	function ($scope, $rootScope, $mdDialog, DMCUserModel) {
		$scope.userBasicInformation;
		$scope.showModalBasicInformations = function(){
			$mdDialog.show({
			    controller: "BasicInformationsController",
			    templateUrl: 'templates/onboarding/basic-informations.html',
			    parent: angular.element(document.body),
			    clickOutsideToClose: false
		    })
		    .then(function(info) {
		    		$scope.userBasicInformation = info;
		      	$scope.showModalTermsConditions();
		    }, function() {
		    });
		}
		$scope.showModalTermsConditions = function(){
			$mdDialog.show({
			    controller: "TermsConditionsController",
			    templateUrl: 'templates/onboarding/terms-conditions.html',
			    parent: angular.element(document.body),
			    locals: {
           userInfo: $scope.userBasicInformation
         	},
			    clickOutsideToClose: false
		    })
		    .then(function(answer) {
		      	$scope.$parent.first = false;
                    $rootScope.userData.companyId = $scope.userBasicInformation.company;
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


