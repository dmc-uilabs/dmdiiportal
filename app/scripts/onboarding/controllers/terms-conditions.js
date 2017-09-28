angular.module('dmc.onboarding')
.controller('TermsConditionsController',
	['$scope', '$rootScope', '$mdDialog','$window', 'userInfo', 'DMCUserModel', "toastModel",
	function ($scope, $rootScope, $mdDialog, $window, userInfo, DMCUserModel, toastModel) {
    $scope.userInfo = userInfo;

	$scope.enter = function(){
		DMCUserModel.onboardingBasicInformation($scope.userInfo, function(response){
		$mdDialog.hide();
		if ($scope.userInfo.company === "13") {
			$window.location.href = '/company-profile.php#/create'
		};
	},	function(){
		toastModel.showToast("error", "Error updating information.");
	})};


}]);
