angular.module('dmc.onboarding')
.controller('BasicInformationsController',
	['$scope', '$rootScope', '$mdDialog','ajax','dataFactory',
	function ($scope, $rootScope, $mdDialog,ajax,dataFactory) {
		$scope.info = {};

		$scope.ctrl = {};
		$scope.ctrl.simulateQuery = false;
		$scope.ctrl.setCompany = setCompany;
		$scope.ctrl.queryCompanySearch = queryCompanySearch;
		$scope.ctrl.searchCompanyChange = searchCompanyChange;

		$scope.isNotDMDIIMember = false;
		$scope.isNotDMDIIMemberStyle = {'color':'lightgrey'};

    var getAllCompanies = function() {
        ajax.get(dataFactory.companyURL().short, {}, function(response){
            $scope.ctrl.companies = response.data;
        });
    }

		getAllCompanies();

		var createCompanyFilterFor = function(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(item) {
				return (item.name.toLowerCase().indexOf(lowercaseQuery) === 0);
			};
		}

		function queryCompanySearch(query) {
			var results = query ? $scope.ctrl.companies.filter( createCompanyFilterFor(query) ) : $scope.ctrl.companies,
				deferred;
			if ($scope.ctrl.simulateQuery) {
				deferred = $q.defer();
				$timeout(function () {
					deferred.resolve(results);
				}, Math.random() * 1000, false);
				return deferred.promise;
			} else {
				return results;
			}
		}

		$scope.$watch('isNotDMDIIMember', function() {
		    changeIsDMDIIMember()
		});

		function changeIsDMDIIMember(){

			if($scope.isNotDMDIIMember){
		    $scope.info.company = 318;
				$scope.isNotDMDIIMemberStyle = {'color':'black'}
		  } else {
				$scope.ctrl.selectedCompany = "";
				$scope.ctrl.searchCompany = "";
		    $scope.info.company = null;
				$scope.isNotDMDIIMemberStyle = {'color':'lightgrey'}
		  }

		}

		function setCompany(company) {
			$scope.info.company = company.id;
		}

		function searchCompanyChange(text) {
			if (text.trim().length == 0) {
				$scope.info.company = null;
			}
		}

    $scope.enter = function(){
			$mdDialog.hide($scope.info);
		};

    function apply() {
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
    }
}]);
