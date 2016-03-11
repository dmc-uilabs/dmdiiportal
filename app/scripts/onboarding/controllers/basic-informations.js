angular.module('dmc.onboarding')
.controller('BasicInformationsController',
	['$scope', '$rootScope', '$mdDialog','ajax','dataFactory',
	function ($scope, $rootScope, $mdDialog,ajax,dataFactory) {
		$scope.info = null;
        $scope.companies = [];

        function getAllCompanies(){
            ajax.get(dataFactory.companyURL().all,{},function(response){
                $scope.companies = response.data;
                apply();
            });
        }
        getAllCompanies();

        $scope.enter = function(){
			$mdDialog.hide($scope.info);
		}

        function apply() {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }
}]);