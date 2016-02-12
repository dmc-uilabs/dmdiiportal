angular.module('dmc.onboarding')
.controller('homeController', 
	['$scope', '$rootScope', '$mdDialog',
	function ($scope, $rootScope, $mdDialog) {
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
		      	$scope.$parent.first = false
		    }, function() {
		    });
		}
		if($scope.first){
			$scope.showModalBasicInformations();
		}
}]);


