angular.module('dmc.onboarding')
.controller('TermsConditionsController', 
	['$scope', '$rootScope', '$mdDialog', 
	function ($scope, $rootScope, $mdDialog) {
		$scope.enter = function(){
			$mdDialog.hide();
		}
}]);