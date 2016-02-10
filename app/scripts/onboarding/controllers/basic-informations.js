angular.module('dmc.onboarding')
.controller('BasicInformationsController', 
	['$scope', '$rootScope', '$mdDialog', 
	function ($scope, $rootScope, $mdDialog) {
		$scope.info = null;
		$scope.enter = function(){
			$mdDialog.hide();
		}
}]);