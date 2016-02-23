angular.module('dmc.onboarding')
.controller('TermsConditionsController',
	['$scope', '$rootScope', '$mdDialog', 'userInfo', 'DMCUserModel', "toastModel",
	function ($scope, $rootScope, $mdDialog, userInfo, DMCUserModel, toastModel) {
    $scope.userInfo = userInfo;
		$scope.enter = function(){
      DMCUserModel.onboardingBasicInformation($scope.userInfo, function(response){
        $mdDialog.hide();
      },
      function(){
        toastModel.showToast("error", "Error updating information.");
      }
      )
		}


}]);